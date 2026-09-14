// ECOMAX Admin — order item price/volume compatibility fix
(function () {
  function install() {
    if (window.__ECOMAX_ADMIN_ORDER_FIX__) return;
    if (!window.viewOrder || !window.orders) return false;

    const originalViewOrder = window.viewOrder;

    window.viewOrder = function (id) {
      const order = window.orders.find(item => String(item.id) === String(id));
      if (!order) return originalViewOrder(id);

      // Normalize cart item fields used by checkout/script.js:
      // { name, price, volume, quantity }
      // Older/admin code expected { product_name, unit_price }.
      if (Array.isArray(order.items)) {
        order.items = order.items.map(item => ({
          ...item,
          product_name: item.product_name || item.name || "პროდუქტი",
          unit_price: Number(
            item.unit_price ?? item.price ?? item.unitPrice ?? item.amount ?? 0
          ),
          quantity: Number(item.quantity || 1),
          volume: item.volume || item.size || ""
        }));
      }

      // Rebuild the modal using the normalized values, while keeping the existing design.
      const esc = value => String(value ?? "")
        .replace(/[&<>"']/g, char => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
        }[char]));
      const money = value => Number(value || 0).toLocaleString("ka-GE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + "₾";
      const statusName = status => ({
        new: "ახალი", processing: "მუშავდება", shipped: "იგზავნება",
        completed: "ჩაბარდა", cancelled: "გაუქმებული"
      }[status] || status || "უცნობი");
      const badge = status => `<span class="badge ${esc(status)}">${esc(statusName(status))}</span>`;
      const date = value => {
        if (!value) return "—";
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("ka-GE");
      };

      const itemsHtml = Array.isArray(order.items) && order.items.length
        ? order.items.map(item => `
            <div class="detail">
              <small>პროდუქტი</small>
              <b>${esc(item.product_name)}</b>
              ${item.volume ? `<div style="margin-top:5px">მოცულობა: ${esc(item.volume)}</div>` : ""}
              <div>რაოდენობა: ${esc(item.quantity)}</div>
              <div>ერთეულის ფასი: ${money(item.unit_price)}</div>
              <div><b>ჯამი: ${money(item.unit_price * item.quantity)}</b></div>
            </div>
          `).join("")
        : `<div class="muted">პროდუქტების დეტალები არ არის.</div>`;

      document.getElementById("orderDetails").innerHTML = `
        <div class="detail-grid">
          <div class="detail"><small>Order Number</small><b>${esc(order.order_number || "—")}</b></div>
          <div class="detail"><small>სტატუსი</small>${badge(order.status)}</div>
          <div class="detail"><small>მომხმარებელი</small>${esc(order.customer_name || "—")}</div>
          <div class="detail"><small>ტელეფონი</small>${esc(order.phone || "—")}</div>
          <div class="detail"><small>ქალაქი</small>${esc(order.city || "—")}</div>
          <div class="detail"><small>მისამართი</small>${esc(order.address || "—")}</div>
          <div class="detail"><small>მიწოდება</small>${esc(order.delivery_method || "—")}</div>
          <div class="detail"><small>გადახდა</small>${esc(order.payment_method || "—")}</div>
          <div class="detail"><small>შეკვეთის თანხა</small><b>${money(order.total)}</b></div>
          <div class="detail"><small>შექმნილია</small>${date(order.created_at)}</div>
        </div>
        <h3 style="margin-top:22px">🧴 პროდუქტები</h3>
        <div class="detail-grid">${itemsHtml}</div>
        ${order.note ? `<div class="detail" style="margin-top:12px"><small>შენიშვნა</small>${esc(order.note)}</div>` : ""}
        <button class="primary" style="width:100%;margin-top:18px" onclick="changeOrderStatus('${esc(order.id)}');closeOrderModal();" type="button">
          ⚙ სტატუსის შეცვლა
        </button>
      `;

      document.getElementById("orderModal")?.classList.add("show");
    };

    window.__ECOMAX_ADMIN_ORDER_FIX__ = true;
    return true;
  }

  function wait() {
    if (install()) return;
    setTimeout(wait, 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wait, { once: true });
  } else {
    wait();
  }
})();
