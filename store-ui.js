(function () {
  "use strict";

  /*
   ECOMAX STORE UI — FIXED
   მოდალი არ უნდა გაიხსნას საიტის ჩატვირთვისას.
   იხსნება მხოლოდ "დეტალურად" ღილაკზე დაჭერისას.
  */

  const CAT = {
    ENGINE: ["ძრავი", "⚙️"],
    LEATHER: ["ტყავი", "◈"],
    TEXTILE: ["ნაჭერი", "▦"],
    WHEEL: ["დისკები", "◉"],
    RADIATOR: ["რადიატორი", "▥"],
    RUST: ["ჟანგი", "⚡"],
    TIRE: ["საბურავი", "◌"],
    DASH: ["პლასტმასი", "◆"],
    FOAM: ["ქაფი", "☁"],
    PERFUME: ["სურნელი", "✦"],
    OTHER: ["სხვა", "✧"]
  };

  let activeCategory = "ALL";
  let modalCard = null;
  let modalVolume = 0.5;
  let modalQty = 1;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const cards = () => $$("#productsGrid .product-card");

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const tag = (card) =>
    (($(".product-tag", card)?.textContent || "OTHER")
      .trim()
      .toUpperCase());

  const category = (t) => CAT[t] || CAT.OTHER;

  const volumeLabel = (v) =>
    v === 0.5 ? "500 მლ" : v + " ლიტრი";

  function getData(card) {
    const select = $(".volume-select", card);

    const options = select
      ? [...select.options].map((o) => ({
          value: num(o.value),
          text: o.textContent.trim()
        }))
      : [
          { value: 0.5, text: "500 მლ — 5 ₾" },
          { value: 1, text: "1 ლიტრი — 10 ₾" }
        ];

    return {
      name:
        $("h3", card)?.textContent.trim() ||
        "ECOMAX პროდუქტი",

      description:
        $("p", card)?.textContent.trim() || "",

      details:
        $$(".product-details div", card)
          .map((x) => x.textContent.trim())
          .join(" "),

      options,

      unit:
        num(card.dataset.unitPrice) || 10,

      tag:
        tag(card),

      code:
        $(".product-number", card)?.textContent.trim() || ""
    };
  }

  function refreshCard(card) {
    const select = $(".volume-select", card);

    if (!select) return;

    const volume =
      num(select.value) || 0.5;

    const unit =
      num(card.dataset.unitPrice) || 10;

    const price =
      volume * unit;

    const label =
      volumeLabel(volume);

    const priceEl =
      $(".selected-price", card);

    const volumeEl =
      $(".selected-volume", card);

    const addBtn =
      $(".add-cart", card);

    if (priceEl) {
      priceEl.textContent =
        price + " ₾";
    }

    if (volumeEl) {
      volumeEl.textContent =
        label;
    }

    if (addBtn) {
      addBtn.dataset.price =
        price;

      addBtn.dataset.volume =
        label;
    }
  }

  function addToCartMany(
    name,
    price,
    volume,
    quantity
  ) {
    if (
      typeof window.addToCart !==
      "function"
    ) {
      return;
    }

    const q =
      Math.max(
        1,
        Math.min(
          99,
          num(quantity) || 1
        )
      );

    for (let i = 0; i < q; i++) {
      window.addToCart(
        name,
        price,
        volume
      );
    }
  }

  function setupCard(card) {
    refreshCard(card);

    const select =
      $(".volume-select", card);

    if (
      select &&
      !select.dataset.ecomaxStoreBound
    ) {
      select.dataset.ecomaxStoreBound =
        "1";

      select.addEventListener(
        "change",
        () => refreshCard(card)
      );
    }

    const oldAdd =
      $(".add-cart", card);

    if (
      oldAdd &&
      !oldAdd.dataset.ecomaxStoreBound
    ) {
      const add =
        oldAdd.cloneNode(true);

      add.dataset.ecomaxStoreBound =
        "1";

      oldAdd.replaceWith(add);

      add.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();

          refreshCard(card);

          const data =
            getData(card);

          const quantity =
            num(
              $(".store-qty-value", card)
                ?.textContent
            ) || 1;

          addToCartMany(
            data.name,
            num(add.dataset.price) ||
              data.unit * 0.5,
            add.dataset.volume ||
              "500 მლ",
            quantity
          );
        }
      );
    }

    if (!$(".store-qty", card)) {
      const quantityBox =
        document.createElement("div");

      quantityBox.className =
        "store-qty";

      quantityBox.innerHTML =
        '<span class="store-qty-label">რაოდენობა</span>' +
        '<div class="store-qty-controls">' +
        '<button type="button" data-ecomax-q="-">−</button>' +
        '<span class="store-qty-value">1</span>' +
        '<button type="button" data-ecomax-q="+">+</button>' +
        "</div>";

      const add =
        $(".add-cart", card);

      if (add) {
        add.parentNode.insertBefore(
          quantityBox,
          add
        );
      }

      quantityBox.addEventListener(
        "click",
        (event) => {
          const button =
            event.target.closest(
              "[data-ecomax-q]"
            );

          if (!button) return;

          event.preventDefault();
          event.stopPropagation();

          const value =
            $(".store-qty-value",
              quantityBox);

          let quantity =
            num(value?.textContent) ||
            1;

          if (
            button.dataset.ecomaxQ ===
            "+"
          ) {
            quantity =
              Math.min(
                99,
                quantity + 1
              );
          } else {
            quantity =
              Math.max(
                1,
                quantity - 1
              );
          }

          if (value) {
            value.textContent =
              quantity;
          }
        }
      );
    }

    if (
      !$(".store-card-actions", card)
    ) {
      const add =
        $(".add-cart", card);

      if (add) {
        const actions =
          document.createElement("div");

        actions.className =
          "store-card-actions";

        add.parentNode.insertBefore(
          actions,
          add
        );

        actions.appendChild(add);

        const details =
          document.createElement("button");

        details.type =
          "button";

        details.className =
          "store-detail-btn";

        details.textContent =
          "დეტალურად";

        actions.appendChild(
          details
        );

        details.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            openModal(card);
          }
        );
      }
    }
  }

  function setupCategories(grid) {
    if ($(".store-category-strip")) {
      return;
    }

    const section =
      grid.closest(
        ".products-section"
      );

    if (!section) return;

    const tags = [
      ...new Set(
        cards().map(tag)
      )
    ];

    const strip =
      document.createElement("div");

    strip.className =
      "store-category-strip";

    const items = [
      ["ALL", "ყველა", "▦"],
      ...tags.map((t) => [
        t,
        category(t)[0],
        category(t)[1]
      ])
    ];

    items.forEach(
      ([key, label, icon]) => {
        const button =
          document.createElement("button");

        button.type =
          "button";

        button.className =
          "store-category-chip" +
          (
            key === "ALL"
              ? " active"
              : ""
          );

        button.dataset.category =
          key;

        button.innerHTML =
          '<span class="cat-icon">' +
          icon +
          "</span>" +
          label;

        button.addEventListener(
          "click",
          () => setCategory(key)
        );

        strip.appendChild(
          button
        );
      }
    );

    const heading =
      $(".section-heading", section);

    if (heading) {
      heading.after(strip);
    } else {
      section.prepend(strip);
    }

    const toolbar =
      document.createElement("div");

    toolbar.className =
      "store-toolbar";

    toolbar.innerHTML =
      '<div><b>ECOMAX SHOP</b>' +
      '<span id="storeResultCount"></span></div>' +
      '<select id="storeSort">' +
      '<option value="default">რეკომენდებული</option>' +
      '<option value="asc">ფასი: დაბლიდან</option>' +
      '<option value="desc">ფასი: მაღლიდან</option>' +
      '<option value="name">სახელით</option>' +
      "</select>";

    strip.after(toolbar);

    $("#storeSort")?.addEventListener(
      "change",
      sortCards
    );

    const layout =
      document.createElement("div");

    layout.className =
      "store-layout";

    const sidebar =
      document.createElement("aside");

    sidebar.className =
      "store-sidebar";

    sidebar.innerHTML =
      '<div class="store-sidebar-head">კატეგორიები</div>' +
      '<div class="store-sidebar-list"></div>' +
      '<div class="store-sidebar-foot">' +
      "<b>მოცულობა</b>" +
      "<span>500 მლ — 20 ლიტრი</span>" +
      "</div>";

    const list =
      $(".store-sidebar-list",
        sidebar);

    const counts = {
      ALL: cards().length
    };

    tags.forEach((t) => {
      counts[t] =
        cards().filter(
          (c) => tag(c) === t
        ).length;
    });

    items.forEach(
      ([key, label, icon]) => {
        const button =
          document.createElement("button");

        button.type =
          "button";

        button.className =
          "store-sidebar-item" +
          (
            key === "ALL"
              ? " active"
              : ""
          );

        button.dataset.category =
          key;

        button.innerHTML =
          "<span>" +
          icon +
          " " +
          label +
          "</span>" +
          "<b>" +
          (counts[key] || 0) +
          "</b>";

        button.addEventListener(
          "click",
          () => setCategory(key)
        );

        list.appendChild(
          button
        );
      }
    );

    grid.parentNode.insertBefore(
      layout,
      grid
    );

    layout.appendChild(
      sidebar
    );

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "store-grid-wrap";

    layout.appendChild(
      wrapper
    );

    wrapper.appendChild(
      grid
    );

    document.body.classList.add(
      "store-ui-ready"
    );
  }

  function setCategory(
    categoryKey
  ) {
    activeCategory =
      categoryKey;

    $$(".store-category-chip")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.category ===
            categoryKey
        );
      });

    $$(".store-sidebar-item")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.category ===
            categoryKey
        );
      });

    cards().forEach(
      (card) => {
        card.classList.toggle(
          "store-hidden",
          categoryKey !== "ALL" &&
          tag(card) !== categoryKey
        );
      }
    );

    updateCount();
  }

  function updateCount() {
    const visible =
      cards().filter(
        (card) =>
          !card.classList.contains(
            "store-hidden"
          )
      ).length;

    const counter =
      $("#storeResultCount");

    if (counter) {
      counter.textContent =
        " • " +
        visible +
        " პროდუქტი";
    }
  }

  function sortCards() {
    const grid =
      $("#productsGrid");

    const mode =
      $("#storeSort")?.value;

    if (!grid) return;

    const list =
      cards();

    list.sort(
      (a, b) => {
        if (mode === "asc") {
          return (
            getData(a).unit -
            getData(b).unit
          );
        }

        if (mode === "desc") {
          return (
            getData(b).unit -
            getData(a).unit
          );
        }

        if (mode === "name") {
          return getData(a)
            .name
            .localeCompare(
              getData(b).name,
              "ka"
            );
        }

        return 0;
      }
    );

    list.forEach(
      (card) =>
        grid.appendChild(card)
    );

    setCategory(
      activeCategory
    );
  }

  /*
   * IMPORTANT:
   * პროდუქტის მოდალი არ იქმნება
   * გვერდის ჩატვირთვისას.
   */

  function modal() {
    let existing =
      $("#ecomaxStoreModal");

    if (existing) {
      return existing;
    }

    const modal =
      document.createElement("div");

    modal.id =
      "ecomaxStoreModal";

    modal.className =
      "store-modal-backdrop";

    modal.hidden =
      true;

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    modal.style.setProperty(
      "display",
      "none",
      "important"
    );

    modal.style.setProperty(
      "visibility",
      "hidden",
      "important"
    );

    modal.style.setProperty(
      "opacity",
      "0",
      "important"
    );

    modal.style.setProperty(
      "pointer-events",
      "none",
      "important"
    );

    modal.innerHTML =
      '<div class="store-modal">' +

      '<button type="button" class="store-modal-close" aria-label="დახურვა">×</button>' +

      '<div class="store-modal-inner">' +

      '<div class="store-modal-visual">' +
      '<div class="store-modal-orbit"></div>' +
      '<div class="store-modal-bottle">' +
      '<strong id="storeBottleText">ECOMAX</strong>' +
      '<span>PROFESSIONAL AUTO CARE</span>' +
      "</div>" +
      "</div>" +

      '<div class="store-modal-content">' +

      '<small id="storeModalTag">ENGINE</small>' +

      '<h3 id="storeModalName">პროდუქტი</h3>' +

      '<p id="storeModalSubtitle"></p>' +

      '<div class="store-rating">★★★★★</div>' +

      '<div class="store-modal-price">' +
      '<strong id="storeModalPrice">5 ₾</strong>' +
      '<span id="storeModalVolume">500 მლ</span>' +
      "</div>" +

      '<b class="store-volume-title">მოცულობის არჩევა</b>' +

      '<div id="storeVolumeOptions" class="store-volume-options"></div>' +

      '<b class="store-volume-title">რაოდენობა</b>' +

      '<div class="store-modal-qty">' +
      '<button type="button" id="storeQtyMinus">−</button>' +
      '<span id="storeModalQty">1</span>' +
      '<button type="button" id="storeQtyPlus">+</button>' +
      "</div>" +

      '<button type="button" id="storeModalAdd" class="store-modal-add">' +
      "🛒 + კალათაში" +
      "</button>" +

      '<div class="store-modal-info">' +

      "<div>" +
      "<h4>აღწერა</h4>" +
      '<p id="storeModalDesc"></p>' +
      "</div>" +

      "<div>" +
      "<h4>მოხმარება / გაზავება</h4>" +
      '<p id="storeModalDetails"></p>' +
      "</div>" +

      "</div>" +

      "</div>" +

      "</div>" +

      "</div>";

    document.body.appendChild(
      modal
    );

    $(".store-modal-close",
      modal
    ).addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        closeModal();
      }
    );

    modal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === modal
        ) {
          closeModal();
        }
      }
    );

    $("#storeQtyMinus")
      .addEventListener(
        "click",
        () => {
          modalQty =
            Math.max(
              1,
              modalQty - 1
            );

          renderQuantity();
        }
      );

    $("#storeQtyPlus")
      .addEventListener(
        "click",
        () => {
          modalQty =
            Math.min(
              99,
              modalQty + 1
            );

          renderQuantity();
        }
      );

    $("#storeModalAdd")
      .addEventListener(
        "click",
        () => {
          if (!modalCard) {
            return;
          }

          const data =
            getData(modalCard);

          addToCartMany(
            data.name,
            modalVolume *
              data.unit,
            volumeLabel(
              modalVolume
            ),
            modalQty
          );

          closeModal();
        }
      );

    return modal;
  }

  function renderQuantity() {
    const value =
      $("#storeModalQty");

    if (value) {
      value.textContent =
        modalQty;
    }
  }

  function openModal(card) {
    const modalElement =
      modal();

    modalCard =
      card;

    modalQty =
      1;

    const data =
      getData(card);

    modalVolume =
      num(
        $(".volume-select", card)
          ?.value
      ) ||
      data.options[0]?.value ||
      0.5;

    $("#storeModalTag")
      .textContent =
      data.tag;

    $("#storeModalName")
      .textContent =
      data.name;

    $("#storeModalSubtitle")
      .textContent =
      "ECOMAX " +
      category(data.tag)[0] +
      " • " +
      (
        data.code ||
        "PRO"
      );

    $("#storeModalDesc")
      .textContent =
      data.description;

    $("#storeModalDetails")
      .textContent =
      data.details ||
      "გამოიყენე ეტიკეტზე მითითებული წესის მიხედვით.";

    $("#storeBottleText")
      .textContent =
      data.name.toUpperCase();

    const volumeBox =
      $("#storeVolumeOptions");

    volumeBox.innerHTML =
      "";

    data.options.forEach(
      (option) => {
        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "store-volume-option" +
          (
            option.value ===
            modalVolume
              ? " active"
              : ""
          );

        button.textContent =
          option.text;

        button.addEventListener(
          "click",
          () => {
            modalVolume =
              option.value;

            renderModal();
          }
        );

        volumeBox.appendChild(
          button
        );
      }
    );

    renderQuantity();
    renderModal();

    /* მხოლოდ აქ ხდება გახსნა */

    modalElement.hidden =
      false;

    modalElement.removeAttribute(
      "aria-hidden"
    );

    modalElement.style.setProperty(
      "display",
      "flex",
      "important"
    );

    modalElement.style.setProperty(
      "visibility",
      "visible",
      "important"
    );

    modalElement.style.setProperty(
      "opacity",
      "1",
      "important"
    );

    modalElement.style.setProperty(
      "pointer-events",
      "auto",
      "important"
    );

    modalElement.classList.add(
      "active"
    );

    document.body.style.overflow =
      "hidden";
  }

  function renderModal() {
    if (!modalCard) {
      return;
    }

    const data =
      getData(modalCard);

    $("#storeModalPrice")
      .textContent =
      modalVolume *
        data.unit +
      " ₾";

    $("#storeModalVolume")
      .textContent =
      volumeLabel(
        modalVolume
      );

    $$(".store-volume-option")
      .forEach(
        (button) => {
          button.classList.toggle(
            "active",
            button.textContent.includes(
              volumeLabel(
                modalVolume
              )
            )
          );
        }
      );
  }

  function closeModal() {
    const modalElement =
      $("#ecomaxStoreModal");

    if (modalElement) {
      modalElement.classList.remove(
        "active"
      );

      modalElement.hidden =
        true;

      modalElement.setAttribute(
        "aria-hidden",
        "true"
      );

      modalElement.style.setProperty(
        "display",
        "none",
        "important"
      );

      modalElement.style.setProperty(
        "visibility",
        "hidden",
        "important"
      );

      modalElement.style.setProperty(
        "opacity",
        "0",
        "important"
      );

      modalElement.style.setProperty(
        "pointer-events",
        "none",
        "important"
      );
    }

    document.body.style.overflow =
      "";

    modalCard =
      null;
  }

  function init() {
    const grid =
      $("#productsGrid");

    if (
      !grid ||
      !cards().length
    ) {
      return;
    }

    setupCategories(
      grid
    );

    cards().forEach(
      setupCard
    );

    updateCount();

    /*
     * ძალიან მნიშვნელოვანია:
     * modal() აქ აღარ იძახება.
     */
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key ===
        "Escape"
      ) {
        closeModal();
      }
    }
  );

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();
