/* Presentation enhancements only. Product data and cart/auth APIs remain in their original modules. */
(() => {
  "use strict";
  const search = document.getElementById("searchInput");
  const filter = document.getElementById("categoryFilter");
  const navSearch = document.getElementById("navSearch");
  const cards = Array.from(document.querySelectorAll(".product-card"));
  const sections = [
    "products",
    "home-care",
    "sprays",
    "accessories",
    "fragrances",
  ].map((id) => document.getElementById(id));
  const status = document.getElementById("searchStatus");

  function updateResults() {
    // Existing filter listeners run first; this adds a glass search across original descriptions.
    const query = search.value.trim().toLocaleLowerCase("ka-GE");
    let count = 0;
    cards.forEach((card) => {
      const text =
        `${card.dataset.search} ${card.querySelector("h3")?.textContent} ${card.querySelector(".product-description")?.textContent}`.toLocaleLowerCase(
          "ka-GE",
        );
      const matchesCategory =
        !filter.value ||
        card.dataset.category === filter.value ||
        (filter.value === "wheels" &&
          ["wheel", "tire"].includes(card.dataset.category));
      const show = matchesCategory && (!query || text.includes(query));
      card.hidden = !show;
      card.style.display = show ? "" : "none";
      count += Number(show);
    });
    sections.forEach((section) => {
      if (!section || section.id === "products") return;
      section.hidden = !Array.from(
        section.querySelectorAll(".product-card"),
      ).some((card) => !card.hidden);
    });
    document.querySelector(".promo-grid").hidden = Boolean(
      query || filter.value,
    );
    status.textContent =
      query || filter.value
        ? count
          ? `ნაპოვნია ${count} პროდუქტი`
          : "პროდუქტი ვერ მოიძებნა. სცადე სხვა სიტყვა ან კატეგორია."
        : "";
    document.querySelectorAll("[data-neon-category]").forEach((link) => {
      link.classList.toggle(
        "is-selected",
        !!filter.value && filter.value === link.dataset.neonCategory,
      );
    });
  }
  search.addEventListener("input", () => {
    navSearch.value = search.value;
    updateResults();
  });
  filter.addEventListener("change", updateResults);
  document.querySelector(".nav-search").addEventListener("submit", (event) => {
    event.preventDefault();
    search.value = navSearch.value;
    filter.value = "";
    updateResults();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
  document.querySelectorAll("[data-neon-category]").forEach((link) =>
    link.addEventListener("click", () => {
      const category = link.dataset.neonCategory;
      search.value = category === "glass" ? "მინის" : "";
      navSearch.value = search.value;
      filter.value = category === "glass" ? "" : category;
      updateResults();
    }),
  );
  document
    .querySelector("[data-reset-products]")
    .addEventListener("click", () => {
      search.value = navSearch.value = filter.value = "";
      updateResults();
    });

  // Native selectors get accessible names without changing their values or prices.
  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent.trim();
    card
      .querySelector(".volume-select")
      ?.setAttribute("aria-label", `${title} — მოცულობა`);
    card
      .querySelector(".add-cart")
      ?.setAttribute("aria-label", `${title} — კალათაში დამატება`);
  });

  // Keep keyboard users inside the existing cart and return them to its trigger.
  const overlay = document.getElementById("cartOverlay");
  const panel = document.getElementById("cartModal");
  let wasOpen = false;
  let previousFocus = null;
  new MutationObserver(() => {
    const open = overlay.classList.contains("active");
    if (open === wasOpen) return;
    wasOpen = open;
    if (open) {
      previousFocus = document.activeElement;
      document.getElementById("closeCart").focus();
    } else if (previousFocus?.isConnected) previousFocus.focus();
  }).observe(overlay, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (wasOpen) window.closeCart();
      if (typeof window.closeMobileMenu === "function")
        window.closeMobileMenu();
    }
    if (!wasOpen || event.key !== "Tab") return;
    const focusable = Array.from(
      panel.querySelectorAll(
        'button:not([disabled]),a[href],input,select,[tabindex="0"]',
      ),
    ).filter((el) => el.getClientRects().length);
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  updateResults();
})();
