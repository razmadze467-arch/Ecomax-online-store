/* ECOMAX — Admin Order Preparation Board
   Uses existing admin "orders" state and quickOrderStatus()/viewOrder() so
   Supabase RLS, status history, courier timestamps and realtime remain intact.
   No custom credentials or direct bypass of existing admin checks.
*/
(function () {
  "use strict";

  const STATES = [
    {key:"new",       icon:"🆕", text:"ახალი"},
    {key:"processing",icon:"🧰", text:"მუშავდება"},
    {key:"loaded",    icon:"📦", text:"ტვირთი დაიტვირთა"},
    {key:"picked_up", icon:"🚚", text:"ტვირთი აიღო კურიერმა"},
    {key:"shipped",   icon:"🛣️", text:"გზაშია"},
    {key:"completed", icon:"✅", text:"ჩაბარდა"},
    {key:"cancelled", icon:"⛔", text:"გაუქმებული"}
  ];
  const ALLOWED = new Set(STATES.map(s=>s.key));
  const QUEUE = new Set(["new","processing"]);
  const drafts = new Map();
  const saving = new Set();
  const selected = new Set();
  let filter = "queue";

  const section = document.getElementById("section-preparation");
  if(!section) return;

  function rows(){
    // The main admin script owns this list. Never cache a stale copy.
    return Array.isArray(orders) ? orders : [];
  }
  function safe(value){return esc(value ?? "");}
  function fmtDate(value){
    if(!value) return "—";
    const d = new Date(value);
    if(!Number.isFinite(d.getTime())) return "—";
    return new Intl.DateTimeFormat("ka-GE",{
      timeZone:"Asia/Tbilisi",year:"numeric",month:"2-digit",
      day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false
    }).format(d);
  }
  function stateLabel(key){
    const s=STATES.find(x=>x.key===key);
    return s ? s.text : String(key||"უცნობი");
  }
  function matching(list){
    if(filter==="all") return list;
    if(filter==="queue") return list.filter(o=>QUEUE.has(o.status));
    return list.filter(o=>o.status===filter);
  }
  function termsMatch(o,needle){
    if(!needle) return true;
    return [
      o.order_number,o.customer_name,o.phone,o.city,o.address
    ].some(value=>String(value ?? "").toLocaleLowerCase().includes(needle));
  }
  function itemsText(order){
    const raw=Array.isArray(order.items)?order.items:[];
    if(!raw.length) return '<span class="ecomax-prep-muted">პროდუქტები მითითებული არ არის.</span>';
    return '<ul class="ecomax-prep-items">'+raw.slice(0,8).map(item=>{
      const name=safe(item.name||item.product_name||"პროდუქტი");
      const qty=Math.max(1,Number(item.quantity)||1);
      return '<li><span>'+name+'</span><strong>× '+safe(qty)+'</strong></li>';
    }).join("")+(raw.length>8?'<li>და კიდევ '+safe(raw.length-8)+' პოზიცია…</li>':"")+'</ul>';
  }
  function countLabel(key,list){
    if(key==="all") return list.length;
    if(key==="queue") return list.filter(o=>QUEUE.has(o.status)).length;
    return list.filter(o=>o.status===key).length;
  }
  function filterButton(key,icon,label,list){
    return '<button type="button" class="ecomax-prep-tab'+
      (filter===key?' is-active':'')+'" data-prep-filter="'+safe(key)+
      '" aria-pressed="'+(filter===key?'true':'false')+'">'+
      '<span aria-hidden="true">'+icon+'</span><span>'+safe(label)+'</span>'+
      '<b>'+countLabel(key,list)+'</b></button>';
  }
  function statusOptions(current){
    return STATES.map(state=>'<option value="'+state.key+'"'+
      (state.key===current?' selected':'')+'>'+state.icon+' '+state.text+'</option>').join("");
  }
  function renderCard(o){
    const id=String(o.id||"");
    if(!id) return "";
    const persisted=String(o.status||"new");
    const draft=drafts.get(id)||persisted;
    const busy=saving.has(id);
    const changed=draft!==persisted;
    const badgeClass=ALLOWED.has(persisted)?persisted:"new";
    const selectedStatus=ALLOWED.has(draft)?draft:persisted;
    return '<article class="ecomax-prep-order" data-order-id="'+safe(id)+'" data-status="'+safe(persisted)+'">'+
      '<header class="ecomax-prep-order-top">'+
        '<label class="ecomax-prep-check-label" title="მონიშნე ჯგუფური წაშლისთვის">'+
          '<input type="checkbox" data-prep-check="'+safe(id)+'"'+(selected.has(id)?' checked':'')+' aria-label="მონიშნე '+safe(o.order_number||id)+'">'+
        '</label>'+
        '<div><span class="ecomax-prep-order-number">'+safe(o.order_number||("ECX-"+id.slice(0,8).toUpperCase()))+'</span>'+
          '<small>შექმნილია: <time>'+safe(fmtDate(o.created_at))+'</time></small></div>'+
        '<span class="ecomax-prep-status '+safe(badgeClass)+'">'+safe(stateLabel(persisted))+'</span>'+
      '</header>'+
      '<div class="ecomax-prep-order-content">'+
        '<div class="ecomax-prep-customer"><strong>'+safe(o.customer_name||"მომხმარებელი")+'</strong>'+
          '<span>'+safe(o.city||"ქალაქი არ არის მითითებული")+'</span>'+
          (o.phone?'<span>📞 '+safe(o.phone)+'</span>':"")+
        '</div>'+
        '<div class="ecomax-prep-products"><strong>🛒 შეკვეთის შემადგენლობა</strong>'+
          itemsText(o)+'</div>'+
      '</div>'+
      '<div class="ecomax-prep-order-total"><span>ჯამი</span><b>'+money(o.total)+'</b></div>'+
      '<div class="ecomax-prep-order-actions">'+
        '<label for="prep-status-'+safe(id)+'">📦 შეკვეთის სტატუსი</label>'+
        '<div class="ecomax-prep-action-row">'+
          '<select id="prep-status-'+safe(id)+'" data-prep-select data-order-id="'+safe(id)+'"'+(busy?' disabled':'')+' aria-label="სტატუსის არჩევა">'+
             statusOptions(selectedStatus)+'</select>'+
          '<button type="button" class="ecomax-prep-save" data-prep-save="'+safe(id)+'"'+
          ((busy||!changed)?' disabled':'')+'>'+
          (busy?'ინახება…':'✓ სტატუსის შენახვა')+'</button>'+
          '<button type="button" class="ecomax-prep-detail" data-prep-details="'+safe(id)+'">დეტალები</button>'+
          '<button type="button" class="ecomax-prep-delete" data-prep-delete="'+safe(id)+'"'+(busy?' disabled':'')+'>🗑 წაშლა</button>'+
        '</div>'+
        '<small class="ecomax-prep-save-hint" aria-live="polite">'+
          (busy?'ცვლილება ინახება…':changed?'შეცვლილი სტატუსი შენახული არ არის.':'შენახული სტატუსი: '+safe(stateLabel(persisted)))+
        '</small>'+
      '</div>'+
    '</article>';
  }

  function visibleChecks(){return [...section.querySelectorAll("[data-prep-check]")];}
  function syncSelectionUI(){
    const checks=visibleChecks();
    const visible=new Set(checks.map(el=>String(el.dataset.prepCheck)));
    for(const id of [...selected])if(!visible.has(id))selected.delete(id);
    const count=section.querySelector("#preparationSelectedCount");
    const all=section.querySelector("#preparationSelectAll");
    const remove=section.querySelector("#preparationDeleteSelected");
    const clear=section.querySelector("#preparationClearSelection");
    if(count)count.textContent="მონიშნულია: "+selected.size;
    if(remove)remove.disabled=!selected.size;
    if(clear)clear.disabled=!selected.size;
    if(all){
      all.checked=checks.length>0&&checks.every(el=>selected.has(String(el.dataset.prepCheck)));
      all.indeterminate=selected.size>0&&!all.checked;
      all.disabled=!checks.length;
    }
  }
  function render(){
    const list=rows();
    const known=new Set(list.map(o=>String(o.id)));
    for(const id of [...selected])if(!known.has(id))selected.delete(id);
    const tabs=section.querySelector("#preparationStatusTabs");
    const grid=section.querySelector("#preparationOrderCards");
    const result=section.querySelector("#preparationResultCount");
    if(!tabs||!grid||!result)return;
    tabs.innerHTML =
      filterButton("queue","🧰","მოსამზადებელი",list)+
      filterButton("all","📦","ყველა",list)+
      STATES.map(x=>filterButton(x.key,x.icon,x.text,list)).join("");

    const q=(section.querySelector("#preparationSearch")?.value||"").trim().toLocaleLowerCase();
    const filtered=matching(list).filter(o=>termsMatch(o,q));
    result.textContent=filtered.length+" შეკვეთა";
    if(!filtered.length){
      grid.innerHTML='<div class="ecomax-prep-empty">📭 ამ კატეგორიაში შეკვეთები არ არის.<small>ახალი შეკვეთები ავტომატურად გამოჩნდება განახლების შემდეგ.</small></div>';
      syncSelectionUI();
      return;
    }
    grid.innerHTML=filtered.map(renderCard).join("");
    syncSelectionUI();
  }

  async function save(orderId,button){
    const id=String(orderId||"");
    const order=rows().find(o=>String(o.id)===id);
    const select=Array.from(section.querySelectorAll("[data-prep-select]"))
      .find(el=>el.dataset.orderId===id);
    if(!order||!select||saving.has(id))return;
    const status=String(select.value);
    if(!ALLOWED.has(status)){toast("აირჩიე სწორი სტატუსი.");return;}
    if(status===order.status){drafts.delete(id);render();return;}
    if(status==="cancelled" && !window.confirm("ნამდვილად გაუქმდეს ეს შეკვეთა?"))return;

    saving.add(id);
    drafts.set(id,status);
    if(button)button.disabled=true;
    select.disabled=true;
    render();
    try{
      // Reuse the single existing server update + history recording path.
      await quickOrderStatus(id,status);
      const updated=rows().find(o=>String(o.id)===id);
      if(updated?.status===status){
        drafts.delete(id);
      }else{
        toast("სტატუსი ვერ განახლდა — გადაამოწმე კავშირი და სცადე ისევ.");
      }
    }catch(error){
      console.error("Order preparation:",error);
      toast("სტატუსის შენახვა ვერ მოხერხდა: "+(error?.message||"უცნობი შეცდომა"));
    }finally{
      saving.delete(id);
      render();
    }
  }

  section.addEventListener("change",event=>{
    const check=event.target.closest("[data-prep-check]");
    if(check){
      const id=String(check.dataset.prepCheck);
      if(check.checked)selected.add(id);else selected.delete(id);
      syncSelectionUI();
      return;
    }
    const select=event.target.closest("[data-prep-select]");
    if(!select)return;
    drafts.set(String(select.dataset.orderId),String(select.value));
    const card=select.closest(".ecomax-prep-order");
    if(!card)return;
    const order=rows().find(o=>String(o.id)===String(select.dataset.orderId));
    const saveBtn=card.querySelector("[data-prep-save]");
    const hint=card.querySelector(".ecomax-prep-save-hint");
    if(saveBtn)saveBtn.disabled=saving.has(String(select.dataset.orderId))||order?.status===select.value;
    if(hint)hint.textContent=order?.status===select.value?"მიმდინარე სტატუსი უკვე შენახულია.":"აირჩიე „სტატუსის შენახვა“, რომ ცვლილება განხორციელდეს.";
  });
  section.addEventListener("click",event=>{
    const tab=event.target.closest("[data-prep-filter]");
    if(tab){selected.clear();filter=tab.dataset.prepFilter||"queue";render();return;}
    const del=event.target.closest("[data-prep-delete]");
    if(del){void deleteAdminOrders([del.dataset.prepDelete]);return;}
    const detail=event.target.closest("[data-prep-details]");
    if(detail){viewOrder(detail.dataset.prepDetails);return;}
    const btn=event.target.closest("[data-prep-save]");
    if(btn){void save(btn.dataset.prepSave,btn);}
  });
  section.querySelector("#preparationSearch")?.addEventListener("input",()=>{
    selected.clear();
    render();
  });
  section.querySelector("#preparationSelectAll")?.addEventListener("change",event=>{
    const active=event.target.checked;
    for(const box of visibleChecks()){
      box.checked=active;
      if(active)selected.add(String(box.dataset.prepCheck));
      else selected.delete(String(box.dataset.prepCheck));
    }
    syncSelectionUI();
  });
  section.querySelector("#preparationClearSelection")?.addEventListener("click",()=>{
    selected.clear();
    for(const box of visibleChecks())box.checked=false;
    syncSelectionUI();
  });
  section.querySelector("#preparationDeleteSelected")?.addEventListener("click",async ()=>{
    const ids=[...selected];
    if(!ids.length)return;
    await deleteAdminOrders(ids);
    render();
  });
  window.ecomaxOnOrdersDeleted=(ids)=>{
    for(const id of ids||[])selected.delete(String(id));
    render();
  };
  section.querySelector("#preparationRefresh")?.addEventListener("click",async e=>{
    const button=e.currentTarget;
    if(button.disabled)return;
    button.disabled=true;button.textContent="⟳ იტვირთება…";
    try{
      await loadOrders();
      render();
    }catch(error){
      console.error("Preparation refresh:",error);
      toast("შეკვეთების ჩატვირთვა ვერ მოხერხდა.");
    }finally{
      button.disabled=false;button.textContent="⟳ განახლება";
    }
  });

  window.renderOrderPreparationBoard=render;
  render();
})();
