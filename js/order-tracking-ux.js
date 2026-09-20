/* ECOMAX — professional order tracking/admin UX */
(function(){
  'use strict';

  const isAccount = /(^|\/)account\.html$/i.test(location.pathname);
  const isAdmin = /(^|\/)admin\.html$/i.test(location.pathname);
  if(!isAccount && !isAdmin) return;

  const style = document.createElement('style');
  style.id = 'ecomax-order-ux-v4';
  style.textContent = String.raw\`
    /* CUSTOMER TRACKING */
    .ecomax-track{position:relative;margin:22px 0 6px;padding:4px 0 2px;display:grid;grid-template-columns:repeat(6,1fr);gap:0}
    .ecomax-track:before{content:"";position:absolute;left:8%;right:8%;top:17px;height:2px;background:linear-gradient(90deg,#00f6ff,#168dff,#7b4dff,#ff25d9);opacity:.18}
    .ecomax-track .et-step{position:relative;text-align:center;min-width:0}
    .ecomax-track .et-dot{width:28px;height:28px;margin:2px auto 8px;border-radius:50%;display:grid;place-items:center;border:1px solid #31515e;background:#07131b;color:#58717b;font-size:12px;position:relative;z-index:2;box-shadow:0 0 0 5px #050c12}
    .ecomax-track .et-step.done .et-dot{color:#001015;border-color:#00f6ff;background:linear-gradient(135deg,#00f6ff,#168dff);box-shadow:0 0 14px rgba(0,246,255,.45),0 0 0 5px #050c12}
    .ecomax-track .et-step.current .et-dot{animation:ecxPulse 1.5s ease-in-out infinite}
    .ecomax-track .et-label{font-size:9px;line-height:1.25;color:#637984;min-height:24px}
    .ecomax-track .et-step.done .et-label{color:#dffcff}
    .ecomax-track .et-time{margin-top:4px;font-size:8px;color:#526873;line-height:1.25}
    .ecomax-track .et-step.current .et-time{color:#00f6ff}
    .ecomax-eta{margin-top:12px;padding:11px 13px;border:1px solid rgba(0,246,255,.18);border-radius:12px;background:linear-gradient(135deg,rgba(0,246,255,.055),rgba(123,77,255,.045));display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}
    .ecomax-eta strong{color:#efffff}.ecomax-eta span{color:#00f6ff;font-weight:800}
    .ecomax-order-info{margin-top:13px;padding:12px;border-top:1px solid rgba(0,246,255,.08);font-size:11px;color:#8ea3ae;line-height:1.8}
    @keyframes ecxPulse{0%,100%{box-shadow:0 0 12px rgba(0,246,255,.35),0 0 0 5px #050c12}50%{box-shadow:0 0 28px rgba(123,77,255,.65),0 0 0 5px #050c12}}
    @media(max-width:650px){.ecomax-track{grid-template-columns:repeat(3,1fr);row-gap:14px}.ecomax-track:before{display:none}.ecomax-track .et-dot{width:25px;height:25px}.ecomax-track .et-label{font-size:8px}.ecomax-track .et-time{font-size:7px}}
    /* ADMIN STATUS MANAGER */
    .ecx-status-modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(0,3,8,.78);backdrop-filter:blur(10px)}
    .ecx-status-box{width:min(620px,100%);max-height:92vh;overflow:auto;padding:22px;border:1px solid rgba(0,246,255,.3);border-radius:22px;background:linear-gradient(145deg,#07151d,#03090e);box-shadow:0 0 80px rgba(0,246,255,.13),inset 0 0 35px rgba(0,246,255,.025)}
    .ecx-status-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}.ecx-status-head h2{margin:0}.ecx-status-sub{margin-top:5px;color:#7e98a2;font-size:11px}
    .ecx-x{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,100,125,.3);background:#180b10;color:#ff9aaa;font-size:20px;cursor:pointer}.ecx-x:hover{background:#ff647d;color:#fff;box-shadow:0 0 20px rgba(255,100,125,.35)}
    .ecx-status-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:18px}; .ecx-quick{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}.ecx-quick button{padding:10px 7px;border-radius:10px;border:1px solid rgba(0,246,255,.15);background:#06151c;color:#bdeff5;font-size:10px;font-weight:800}.ecx-quick button:hover,.ecx-quick button.active{border-color:#00f6ff;background:rgba(0,246,255,.1);box-shadow:0 0 15px rgba(0,246,255,.12)}@media(max-width:650px){.ecx-quick{grid-template-columns:repeat(2,1fr)}}.ecx-status-buttons{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.ecx-status-choice{padding:10px 8px;border-radius:9px;border:1px solid rgba(0,246,255,.12);background:#031016;color:#8ea6af;font-size:10px;font-weight:800;cursor:pointer}.ecx-status-choice.active{color:#001015;background:linear-gradient(135deg,#00f6ff,#168dff);border-color:#00f6ff;box-shadow:0 0 16px rgba(0,246,255,.2)}.ecx-status-choice.danger-choice{color:#ff9aaa;border-color:rgba(255,100,125,.2)}.ecx-status-choice.danger-choice.active{color:#fff;background:linear-gradient(135deg,#ff647d,#b83d59);border-color:#ff647d}.ecx-field{padding:12px;border:1px solid rgba(0,246,255,.14);border-radius:12px;background:#061119}.ecx-field label{display:block;color:#7e98a2;font-size:10px;margin-bottom:6px}.ecx-field select,.ecx-field input{width:100%;padding:10px;border-radius:9px;border:1px solid rgba(0,246,255,.2);background:#02090e;color:#fff;outline:none}.ecx-field input:focus,.ecx-field select:focus{border-color:#00f6ff;box-shadow:0 0 15px rgba(0,246,255,.12)}
    .ecx-status-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:18px}.ecx-btn{padding:11px 15px;border-radius:10px;border:1px solid rgba(0,246,255,.22);background:#071820;color:#eaffff;font-weight:800}.ecx-btn.primary{background:linear-gradient(135deg,#00cfe3,#168dff);color:#001015;border:0}.ecx-history{margin-top:18px;border-top:1px solid rgba(0,246,255,.1);padding-top:14px}.ecx-history-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:10px;color:#91a7b0}.ecx-history-row b{color:#eaffff}.ecx-history-row span{color:#00f6ff;text-align:right}
    .ecx-admin-times{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:14px}.ecx-admin-time{padding:9px;border:1px solid rgba(0,246,255,.1);border-radius:9px;background:#061119}.ecx-admin-time small{display:block;color:#718891;font-size:8px}.ecx-admin-time b{display:block;margin-top:4px;font-size:9px;color:#dffcff}
    @media(max-width:650px){.ecx-status-grid{grid-template-columns:1fr}.ecx-status-buttons{grid-template-columns:1fr 1fr}.ecx-admin-times{grid-template-columns:1fr 1fr}.ecx-status-actions{flex-direction:column}.ecx-btn{width:100%}}
  \`;
  document.head.appendChild(style);

  const labels={new:'შეკვეთა მიღებულია',processing:'მზადდება',loaded:'ტვირთი დაიტვირთა',picked_up:'კურიერმა აიღო',shipped:'გზაშია',completed:'ჩაბარდა',cancelled:'გაუქმებული'};
  const steps=['new','processing','loaded','picked_up','shipped','completed'];

  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]||c));}
  function dt(v,withSeconds=false){if(!v)return '—';const d=new Date(v);if(Number.isNaN(d.getTime()))return '—';return d.toLocaleString('ka-GE',withSeconds?{dateStyle:'medium',timeStyle:'medium'}:{dateStyle:'medium',timeStyle:'short'});}
  function isoLocal(v){if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return '';const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes());}

  function accountTimeline(card){
    const status=(card.querySelector('.status')?.className.match(/status\s+([a-z_]+)/)||[])[1]||'new';
    const number=card.querySelector('.order-number')?.textContent?.replace(/^📦\s*/,'').trim()||'';
    const cards=window.__ECOMAX_ORDER_DATA||{};
    const o=cards[number];
    const current=steps.indexOf(status);
    const times={
      new:o?.created_at,
      processing:o?.updated_at,
      loaded:o?.cargo_loaded_at,
      picked_up:o?.cargo_picked_up_at,
      shipped:o?.departed_at,
      completed:o?.delivered_at
    };
    const icons=['✓','⚙','📦','🚚','➜','✓'];
    const labels2=['მიღებულია','მზადდება','დატვირთულია','კურიერთან','გზაშია','ჩაბარდა'];
    const html=steps.map((s,i)=>{
      const done=current>=i;
      const cur=current===i;
      return '<div class="et-step '+(done?'done ':'')+(cur?'current':'')+'"><div class="et-dot">'+icons[i]+'</div><div class="et-label">'+labels2[i]+'</div><div class="et-time">'+(times[s]?esc(dt(times[s])):(done?'✓':'') )+'</div></div>';
    }).join('');
    let old=card.querySelector('.timeline');
    if(old){old.outerHTML='<div class="ecomax-track" data-ecx-enhanced="1">'+html+'</div>';}
    else if(!card.querySelector('.ecomax-track')) card.insertAdjacentHTML('beforeend','<div class="ecomax-track">'+html+'</div>');
    let eta=card.querySelector('.ecomax-eta');
    if(!eta && o?.estimated_arrival_at) card.insertAdjacentHTML('beforeend','<div class="ecomax-eta"><strong>🕐 სავარაუდო ჩამოსვლა</strong><span>'+esc(dt(o.estimated_arrival_at))+'</span></div>');
  }

  function enhanceAccount(){
    const container=document.getElementById('orders');
    if(!container)return;
    const cards=container.querySelectorAll('.order-card');
    cards.forEach(card=>accountTimeline(card));
  }

  if(isAccount){
    const observer=new MutationObserver(()=>enhanceAccount());
    const start=()=>{const c=document.getElementById('orders');if(c){observer.observe(c,{childList:true,subtree:true});enhanceAccount();}};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  }

  async function adminStatusManager(id){
    const db=window.ECOMAX_SUPABASE_CLIENT;
    if(!db)return;
    const {data:o,error}=await db.from('orders').select('*').eq('id',id).single();
    if(error||!o){alert(error?.message||'შეკვეთა ვერ მოიძებნა');return;}
    const old=document.getElementById('ecxStatusModal');if(old)old.remove();
    const m=document.createElement('div');m.id='ecxStatusModal';m.className='ecx-status-modal';
    m.innerHTML='<div class="ecx-status-box">'+
      '<div class="ecx-status-head"><div><h2>📦 შეკვეთის მართვა</h2><div class="ecx-status-sub">'+esc(o.order_number||id)+'</div></div><button class="ecx-x" type="button">×</button></div>'+
      '<div class="ecx-admin-times">'+
      '<div class="ecx-admin-time"><small>დატვირთვა</small><b>'+esc(dt(o.cargo_loaded_at))+'</b></div>'+
      '<div class="ecx-admin-time"><small>კურიერი</small><b>'+esc(dt(o.cargo_picked_up_at))+'</b></div>'+
      '<div class="ecx-admin-time"><small>გასვლა</small><b>'+esc(dt(o.departed_at))+'</b></div>'+
      '<div class="ecx-admin-time"><small>ETA</small><b>'+esc(dt(o.estimated_arrival_at))+'</b></div>'+
      '<div class="ecx-admin-time"><small>ადგილზე</small><b>'+esc(dt(o.arrived_at))+'</b></div>'+
      '<div class="ecx-admin-time"><small>ჩაბარდა</small><b>'+esc(dt(o.delivered_at))+'</b></div></div>'+
      '<div class="ecx-field ecx-status-picker"><label>სტატუსი</label><div class="ecx-status-buttons">'+steps.map(s=>'<button type="button" class="ecx-status-choice '+(s===(o.status||'new')?'active':'')+'" data-status="'+s+'">'+labels[s]+'</button>').join('')+'<button type="button" class="ecx-status-choice danger-choice '+(o.status==='cancelled'?'active':'')+'" data-status="cancelled">გაუქმებული</button></div><input id="ecxStatus" type="hidden" value="'+esc(o.status||'new')+'"></div>'+
      '<div class="ecx-field"><label>🕐 სავარაუდო ჩამოსვლა</label><input id="ecxEta" type="datetime-local" value="'+esc(isoLocal(o.estimated_arrival_at))+'"></div>'+
      '<div class="ecx-field"><label>ტვირთის დატვირთვის დრო</label><input id="ecxLoaded" type="datetime-local" value="'+esc(isoLocal(o.cargo_loaded_at))+'"></div>'+
      '<div class="ecx-field"><label>კურიერის აღების დრო</label><input id="ecxPicked" type="datetime-local" value="'+esc(isoLocal(o.cargo_picked_up_at))+'"></div>'+
      '<div class="ecx-field"><label>გასვლის დრო</label><input id="ecxDeparted" type="datetime-local" value="'+esc(isoLocal(o.departed_at))+'"></div>'+
      '<div class="ecx-field"><label>ადგილზე მისვლის დრო</label><input id="ecxArrived" type="datetime-local" value="'+esc(isoLocal(o.arrived_at))+'"></div>'+
      '<div class="ecx-field"><label>ჩაბარების დრო</label><input id="ecxDelivered" type="datetime-local" value="'+esc(isoLocal(o.delivered_at))+'"></div>'+
      '</div>'+
      '<div class="ecx-status-actions"><button class="ecx-btn" id="ecxCancel" type="button">გაუქმება</button><button class="ecx-btn primary" id="ecxSave" type="button">💾 შენახვა</button></div>'+
      '<div class="ecx-history"><b>📜 სტატუსის ისტორია</b><div id="ecxHistoryRows" style="margin-top:7px;color:#7e98a2;font-size:10px">იტვირთება...</div></div>'+
      '</div>';
    document.body.appendChild(m);
    m.querySelectorAll('.ecx-status-choice').forEach(b=>b.addEventListener('click',()=>{
      m.querySelectorAll('.ecx-status-choice').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      m.querySelector('#ecxStatus').value=b.dataset.status;
    }));
    const close=()=>m.remove();
    m.querySelector('.ecx-x').onclick=close;m.querySelector('#ecxCancel').onclick=close;
    m.addEventListener('click',e=>{if(e.target===m)close();});
    m.querySelector('#ecxSave').onclick=async()=>{
      const status=m.querySelector('#ecxStatus').value;
      const val=id=>{const x=m.querySelector(id).value;return x?new Date(x).toISOString():null;};
      const patch={status,updated_at:new Date().toISOString(),cargo_loaded_at:val('#ecxLoaded'),cargo_picked_up_at:val('#ecxPicked'),departed_at:val('#ecxDeparted'),arrived_at:val('#ecxArrived'),estimated_arrival_at:val('#ecxEta'),delivered_at:val('#ecxDelivered')};
      const btn=m.querySelector('#ecxSave');btn.disabled=true;btn.textContent='ინახება...';
      const up=await db.from('orders').update(patch).eq('id',id);
      if(up.error){btn.disabled=false;btn.textContent='💾 შენახვა';alert(up.error.message);return;}
      /* Status history is recorded automatically by the database trigger. */
      close();
      if(typeof window.refreshAll==='function') await window.refreshAll(); else location.reload();
    };
    const h=await db.from('order_status_history').select('*').eq('order_id',id).order('created_at',{ascending:false}).limit(12);
    const hr=m.querySelector('#ecxHistoryRows');
    if(h.error) hr.textContent='ისტორია ვერ ჩაიტვირთა';
    else if(!h.data?.length) hr.textContent='ისტორია ჯერ არ არის';
    else hr.innerHTML=h.data.map(x=>'<div class="ecx-history-row"><b>'+esc(labels[x.new_status]||x.new_status||'—')+'</b><span>'+esc(dt(x.created_at))+'</span></div>').join('');
  }

  if(isAdmin){
    const boot=()=>{
      const wait=()=>{if(typeof window.changeOrderStatus==='function'){window.changeOrderStatus=adminStatusManager;return;}setTimeout(wait,120);};
      wait();
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  }
})();