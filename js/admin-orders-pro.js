// ECOMAX Admin — Orders Pro layer
(function () {
  'use strict';

  const ADMIN_EMAIL = 'datogringo@gmail.com';
  const STATUSES = [
    ['new', 'ახალი'],
    ['processing', 'მუშავდება'],
    ['shipped', 'იგზავნება'],
    ['completed', 'ჩაბარდა'],
    ['cancelled', 'გაუქმებული']
  ];

  let rows = [];
  let channel = null;
  let timer = null;
  let ready = false;

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));
  const money = value => Number(value || 0).toLocaleString('ka-GE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '₾';
  const date = value => {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('ka-GE');
  };
  const statusName = value => (STATUSES.find(x => x[0] === value)?.[1] || value || 'უცნობი');

  function toast(message) {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(window.__ecomaxOrdersToast);
    window.__ecomaxOrdersToast = setTimeout(() => el.classList.remove('show'), 3000);
  }

  async function client() {
    if (window.ECOMAX_AUTH_READY) await window.ECOMAX_AUTH_READY;
    return window.ECOMAX_SUPABASE_CLIENT || null;
  }

  async function isAdmin(db) {
    if (!db) return false;
    const { data } = await db.auth.getUser();
    return !!(data?.user?.email && data.user.email.toLowerCase() === ADMIN_EMAIL);
  }

  async function load() {
    const db = await client();
    if (!db || !(await isAdmin(db))) return false;

    const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('ECOMAX Orders Pro:', error);
      toast('შეკვეთების ჩატვირთვა ვერ მოხერხდა');
      return false;
    }
    rows = data || [];
    render();
    return true;
  }

  function filtered() {
    const q = ($('orderSearch')?.value || '').trim().toLowerCase();
    const status = $('orderStatusFilter')?.value || '';
    return rows.filter(o => {
      const hay = [o.order_number, o.customer_name, o.phone, o.city, o.address, o.payment_method, o.delivery_method]
        .join(' ').toLowerCase();
      return (!q || hay.includes(q)) && (!status || o.status === status);
    });
  }

  function itemSummary(order) {
    if (!Array.isArray(order.items)) return '—';
    return order.items.map(i => {
      const name = i.product_name || i.name || 'პროდუქტი';
      const volume = i.volume || i.size || '';
      const qty = Number(i.quantity || 1);
      return `${name}${volume ? ` (${volume})` : ''} × ${qty}`;
    }).join(', ');
  }

  function render() {
    const table = $('ordersTable');
    if (!table) return;
    const list = filtered();
    if (!list.length) {
      table.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#8da8b0">შეკვეთები ვერ მოიძებნა.</td></tr>';
      return;
    }
    table.innerHTML = list.map(o => `
      <tr>
        <td><b>${esc(o.order_number || o.id || '—')}</b></td>
        <td>${esc(o.customer_name || '—')}</td>
        <td>${esc(o.phone || '—')}</td>
        <td>${esc(o.city || '—')}</td>
        <td><b>${money(o.total)}</b></td>
        <td>
          <select class="field" style="min-width:135px;padding:7px 8px" onchange="ECOMAX_ADMIN_ORDERS_PRO.setStatus('${esc(o.id)}',this.value)">
            ${STATUSES.map(s => `<option value="${s[0]}" ${o.status === s[0] ? 'selected' : ''}>${s[1]}</option>`).join('')}
          </select>
        </td>
        <td>${date(o.created_at)}</td>
        <td><button class="small-btn" type="button" onclick="ECOMAX_ADMIN_ORDERS_PRO.view('${esc(o.id)}')">👁 დეტალები</button></td>
      </tr>
    `).join('');
  }

  function view(id) {
    const o = rows.find(x => String(x.id) === String(id));
    if (!o) return;
    const items = Array.isArray(o.items) ? o.items.map(i => {
      const name = i.product_name || i.name || 'პროდუქტი';
      const volume = i.volume || i.size || '';
      const qty = Number(i.quantity || 1);
      const unit = Number(i.unit_price ?? i.price ?? i.unitPrice ?? 0);
      return `<div class="detail"><small>პროდუქტი</small><b>${esc(name)}</b>${volume ? `<div>მოცულობა: ${esc(volume)}</div>` : ''}<div>რაოდენობა: ${qty}</div><div>ერთეულის ფასი: ${money(unit)}</div><div><b>ჯამი: ${money(unit * qty)}</b></div></div>`;
    }).join('') : '';
    const box = $('orderDetails');
    if (!box) return;
    box.innerHTML = `
      <div class="detail-grid">
        <div class="detail"><small>Order Number</small><b>${esc(o.order_number || o.id || '—')}</b></div>
        <div class="detail"><small>სტატუსი</small><b>${esc(statusName(o.status))}</b></div>
        <div class="detail"><small>მომხმარებელი</small>${esc(o.customer_name || '—')}</div>
        <div class="detail"><small>ტელეფონი</small>${esc(o.phone || '—')}</div>
        <div class="detail"><small>ქალაქი</small>${esc(o.city || '—')}</div>
        <div class="detail"><small>მისამართი</small>${esc(o.address || '—')}</div>
        <div class="detail"><small>მიწოდება</small>${esc(o.delivery_method || '—')}</div>
        <div class="detail"><small>გადახდა</small>${esc(o.payment_method || '—')}</div>
        <div class="detail"><small>შეკვეთის თანხა</small><b>${money(o.total)}</b></div>
        <div class="detail"><small>შექმნილია</small>${date(o.created_at)}</div>
      </div>
      <h3 style="margin-top:22px">🧴 პროდუქტები</h3>
      <div class="detail-grid">${items || '<div class="muted">პროდუქტების დეტალები არ არის.</div>'}</div>
      <div class="detail" style="margin-top:12px"><small>შეკვეთის მონაცემები</small>${esc(itemSummary(o))}</div>
    `;
    $('orderModal')?.classList.add('show');
  }

  async function setStatus(id, status) {
    if (!STATUSES.some(x => x[0] === status)) return;
    const db = await client();
    if (!db || !(await isAdmin(db))) return;
    const { error } = await db.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      console.error('ECOMAX status update:', error);
      toast('სტატუსის შეცვლა ვერ მოხერხდა');
      await load();
      return;
    }
    const local = rows.find(x => String(x.id) === String(id));
    if (local) { local.status = status; local.updated_at = new Date().toISOString(); }
    render();
    toast('სტატუსი განახლდა ✓');
  }

  function csv() {
    const header = ['order_number','customer_name','phone','city','address','status','total','payment_method','delivery_method','created_at'];
    const lines = [header, ...rows.map(o => header.map(k => o[k] ?? ''))].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ecomax-orders.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function addControls() {
    const toolbar = document.querySelector('#section-orders .toolbar');
    if (!toolbar || toolbar.querySelector('[data-orders-pro]')) return;
    const refresh = document.createElement('button');
    refresh.type = 'button'; refresh.className = 'primary'; refresh.dataset.ordersPro = '1';
    refresh.textContent = '🔄 განახლება'; refresh.onclick = async () => { await load(); toast('შეკვეთები განახლდა ✓'); };
    const exportBtn = document.createElement('button');
    exportBtn.type = 'button'; exportBtn.className = 'small-btn'; exportBtn.textContent = '⬇ CSV'; exportBtn.onclick = csv;
    toolbar.append(refresh, exportBtn);
  }

  function realtime(db) {
    if (!db || channel) return;
    try {
      channel = db.channel('ecomax-admin-orders-pro')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
        .subscribe();
    } catch (e) { console.warn('Orders realtime unavailable:', e); }
  }

  async function install() {
    if (ready || !location.pathname.toLowerCase().endsWith('admin.html')) return;
    const db = await client();
    if (!db || !(await isAdmin(db))) return;
    ready = true;
    addControls();
    await load();
    realtime(db);
    clearInterval(timer);
    timer = setInterval(load, 30000);
  }

  window.ECOMAX_ADMIN_ORDERS_PRO = { load, render, setStatus, view, csv };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(install, 250), { once: true });
  else setTimeout(install, 250);
})();
