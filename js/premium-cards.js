/* =========================================================
   ECOMAX — PREMIUM CARD PERIMETER CARS
   Version: 2026-09-21-FINAL
   ========================================================= */

(() => {
  "use strict";

  if (window.__ECOMAX_PREMIUM_PERIMETER_CARS__) return;
  window.__ECOMAX_PREMIUM_PERIMETER_CARS__ = true;

  /* ---------------------------------------------------------
     CSS
     --------------------------------------------------------- */

  const css = `
    /* Hide all old car systems */
    .ecomax-orbit-cars,
    .ecomax-static-cars,
    .ecomax-card-cars,
    .ecomax-static-car,
    .ecomax-mini-car,
    .ecomax-card-road {
      display:none !important;
      visibility:hidden !important;
      pointer-events:none !important;
    }

    /* Card itself */
    .product-card,
    .pro-product-card {
      position:relative !important;
      overflow:hidden !important;
      isolation:isolate !important;
    }

    /* Neon frame */
    .product-card::before,
    .pro-product-card::before {
      content:"";
      position:absolute;
      inset:0;
      border:1.5px solid rgba(0,245,255,.72);
      border-radius:22px;
      pointer-events:none;
      z-index:20;
      box-shadow:
        0 0 7px rgba(0,245,255,.25),
        inset 0 0 7px rgba(0,245,255,.08);
    }

    .product-card::after,
    .pro-product-card::after {
      content:"";
      position:absolute;
      inset:0;
      border:1px solid rgba(255,45,180,.18);
      border-radius:22px;
      pointer-events:none;
      z-index:19;
      box-shadow:
        0 0 18px rgba(255,45,180,.08);
    }

    /* Car track layer */
    .ecomax-perimeter-cars {
      position:absolute !important;
      inset:0 !important;
      width:100% !important;
      height:100% !important;
      pointer-events:none !important;
      z-index:999999 !important;
      overflow:visible !important;
    }

    /* Individual car */
    .ecomax-perimeter-car {
      position:absolute !important;
      left:0 !important;
      top:0 !important;

      width:34px !important;
      height:18px !important;

      transform-origin:50% 50% !important;

      pointer-events:none !important;
      user-select:none !important;

      will-change:transform;

      filter:
        drop-shadow(0 0 3px currentColor)
        drop-shadow(0 0 7px currentColor);

      z-index:999999 !important;
    }

    .ecomax-perimeter-car.cyan {
      color:#00f5ff;
    }

    .ecomax-perimeter-car.pink {
      color:#ff35d0;
    }

    @media (max-width:700px){

      .product-card::before,
      .pro-product-card::before {
        border-radius:18px;
      }

      .product-card::after,
      .pro-product-card::after {
        border-radius:18px;
      }

      .ecomax-perimeter-car {
        width:30px !important;
        height:16px !important;
      }
    }
  `;

  const style = document.createElement("style");
  style.id = "ecomax-premium-perimeter-style";
  style.textContent = css;
  document.head.appendChild(style);


  /* ---------------------------------------------------------
     SVG CAR
     --------------------------------------------------------- */

  function carSVG(type) {

    const color =
      type === "pink"
        ? "#ff35d0"
        : "#00f5ff";

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 52"
        preserveAspectRatio="none"
        aria-hidden="true"
      >

        <!-- glow body -->
        <path
          d="
            M7 31
            L15 22
            L31 22
            L42 12
            L70 12
            L83 22
            L91 24
            L95 32
            L93 38
            L7 38
            Z
          "
          fill="${color}"
          fill-opacity=".13"
          stroke="${color}"
          stroke-width="2.4"
          stroke-linejoin="round"
        />

        <!-- windshield -->
        <path
          d="
            M43 14
            L53 14
            L53 22
            L36 22
            Z
          "
          fill="${color}"
          fill-opacity=".28"
          stroke="${color}"
          stroke-width="1"
        />

        <path
          d="
            M56 14
            L69 14
            L78 22
            L56 22
            Z
          "
          fill="${color}"
          fill-opacity=".22"
          stroke="${color}"
          stroke-width="1"
        />

        <!-- headlights -->
        <circle
          cx="91"
          cy="29"
          r="2"
          fill="#ffffff"
        />

        <circle
          cx="91"
          cy="29"
          r="4"
          fill="${color}"
          fill-opacity=".25"
        />

        <!-- wheels -->
        <circle
          cx="26"
          cy="38"
          r="7"
          fill="#050810"
          stroke="${color}"
          stroke-width="2"
        />

        <circle
          cx="26"
          cy="38"
          r="2.2"
          fill="${color}"
        />

        <circle
          cx="76"
          cy="38"
          r="7"
          fill="#050810"
          stroke="${color}"
          stroke-width="2"
        />

        <circle
          cx="76"
          cy="38"
          r="2.2"
          fill="${color}"
        />

        <!-- neon underglow -->
        <path
          d="M17 43 L84 43"
          stroke="${color}"
          stroke-width="2"
          stroke-linecap="round"
          opacity=".8"
        />

      </svg>
    `;
  }


  /* ---------------------------------------------------------
     CREATE CARS
     --------------------------------------------------------- */

  function createCars(card) {

    if (!card || card.dataset.ecomaxCarsReady === "1") {
      return;
    }

    card.dataset.ecomaxCarsReady = "1";

    const layer = document.createElement("div");
    layer.className = "ecomax-perimeter-cars";

    const cyan = document.createElement("div");
    cyan.className = "ecomax-perimeter-car cyan";
    cyan.innerHTML = carSVG("cyan");

    const pink = document.createElement("div");
    pink.className = "ecomax-perimeter-car pink";
    pink.innerHTML = carSVG("pink");

    layer.appendChild(cyan);
    layer.appendChild(pink);

    card.appendChild(layer);

    startPerimeterAnimation(card, cyan, pink);
  }


  /* ---------------------------------------------------------
     BORDER RADIUS
     --------------------------------------------------------- */

  function getRadius(card, width, height) {

    const style = getComputedStyle(card);

    let radius = parseFloat(style.borderTopLeftRadius);

    if (!Number.isFinite(radius)) {
      radius = 20;
    }

    /*
      Keep radius inside valid bounds.
    */
    const maxRadius = Math.min(width, height) / 2;

    return Math.max(
      4,
      Math.min(radius, maxRadius - 1)
    );
  }


  /* ---------------------------------------------------------
     ROUNDED RECTANGLE PATH
     --------------------------------------------------------- */

  function pointAt(card, distance) {

    const rect = card.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    if (width < 10 || height < 10) {
      return {
        x: width / 2,
        y: height / 2,
        angle: 0,
        length: 1
      };
    }

    /*
      Border centerline.

      The CSS border is around the card.
      We use a 1px inset so the car sits
      directly on the visible neon frame.
    */

    const inset = 1.2;

    const left = inset;
    const top = inset;
    const right = width - inset;
    const bottom = height - inset;

    const radius = getRadius(card, width, height);

    const r = Math.min(
      radius,
      (right - left) / 2 - 1,
      (bottom - top) / 2 - 1
    );

    const straightTop = right - left - 2 * r;
    const straightRight = bottom - top - 2 * r;

    const arcLength = Math.PI * r / 2;

    /*
      Total perimeter:
      top straight
      top-right arc
      right straight
      bottom-right arc
      bottom straight
      bottom-left arc
      left straight
      top-left arc
    */

    const perimeter =
      straightTop +
      arcLength +
      straightRight +
      arcLength +
      straightTop +
      arcLength +
      straightRight +
      arcLength;

    let d =
      ((distance % perimeter) + perimeter) %
      perimeter;


    /* =========================
       1. TOP
       ========================= */

    if (d <= straightTop) {

      return {
        x: left + r + d,
        y: top,
        angle: 0,
        length: perimeter
      };
    }

    d -= straightTop;


    /* =========================
       2. TOP RIGHT CORNER
       ========================= */

    if (d <= arcLength) {

      const a =
        -Math.PI / 2 +
        d / r;

      const cx = right - r;
      const cy = top + r;

      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        angle: a + Math.PI / 2,
        length: perimeter
      };
    }

    d -= arcLength;


    /* =========================
       3. RIGHT
       ========================= */

    if (d <= straightRight) {

      return {
        x: right,
        y: top + r + d,
        angle: Math.PI / 2,
        length: perimeter
      };
    }

    d -= straightRight;


    /* =========================
       4. BOTTOM RIGHT CORNER
       ========================= */

    if (d <= arcLength) {

      const a =
        d / r;

      const cx = right - r;
      const cy = bottom - r;

      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        angle: a + Math.PI / 2,
        length: perimeter
      };
    }

    d -= arcLength;


    /* =========================
       5. BOTTOM
       ========================= */

    if (d <= straightTop) {

      return {
        x: right - r - d,
        y: bottom,
        angle: Math.PI,
        length: perimeter
      };
    }

    d -= straightTop;


    /* =========================
       6. BOTTOM LEFT CORNER
       ========================= */

    if (d <= arcLength) {

      const a =
        Math.PI / 2 +
        d / r;

      const cx = left + r;
      const cy = bottom - r;

      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        angle: a + Math.PI / 2,
        length: perimeter
      };
    }

    d -= arcLength;


    /* =========================
       7. LEFT
       ========================= */

    if (d <= straightRight) {

      return {
        x: left,
        y: bottom - r - d,
        angle: -Math.PI / 2,
        length: perimeter
      };
    }

    d -= straightRight;


    /* =========================
       8. TOP LEFT CORNER
       ========================= */

    const a =
      Math.PI +
      d / r;

    const cx = left + r;
    const cy = top + r;

    return {
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      angle: a + Math.PI / 2,
      length: perimeter
    };
  }


  /* ---------------------------------------------------------
     ANIMATION
     --------------------------------------------------------- */

  function startPerimeterAnimation(card, cyan, pink) {

    let startTime = performance.now();

    /*
      Speed in pixels/second.
      Lower = slower.
    */
    const speed = 48;

    /*
      Second car is offset by roughly half
      of the perimeter so they remain separated.
    */

    function animate(now) {

      if (!document.documentElement.contains(card)) {
        return;
      }

      const rect = card.getBoundingClientRect();

      if (rect.width < 20 || rect.height < 20) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed =
        (now - startTime) / 1000;

      const perimeterInfo =
        pointAt(card, 0);

      const perimeter =
        perimeterInfo.length;

      /*
        Cyan:
        clockwise
      */
      const cyanDistance =
        (elapsed * speed) % perimeter;

      /*
        Pink:
        counter-clockwise
        with approximately half-track offset
      */
      const pinkDistance =
        perimeter -
        (
          (elapsed * speed * 0.82 +
            perimeter * 0.50) %
          perimeter
        );

      const c =
        pointAt(card, cyanDistance);

      const p =
        pointAt(card, pinkDistance);


      /*
        Car SVG points to the RIGHT by default.
        Therefore rotate according to tangent.
      */

      cyan.style.transform =
        `translate3d(
          ${c.x}px,
          ${c.y}px,
          0
        )
        translate(-50%, -50%)
        rotate(${c.angle}rad)`;


      pink.style.transform =
        `translate3d(
          ${p.x}px,
          ${p.y}px,
          0
        )
        translate(-50%, -50%)
        rotate(${p.angle}rad)`;


      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }


  /* ---------------------------------------------------------
     SCAN CARDS
     --------------------------------------------------------- */

  function scanCards() {

    const cards =
      document.querySelectorAll(
        ".product-card, .pro-product-card"
      );

    cards.forEach(createCars);
  }


  /* ---------------------------------------------------------
     INITIAL LOAD
     --------------------------------------------------------- */

  function init() {

    scanCards();

    /*
      Product cards may be rendered later
      by JavaScript, so observe DOM changes.
    */

    const observer =
      new MutationObserver(() => {

        scanCards();

      });

    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );


    /*
      Recalculate naturally after resize.
      No need to restart animation because
      pointAt() reads current dimensions.
    */

    window.addEventListener(
      "resize",
      () => {
        scanCards();
      },
      { passive:true }
    );
  }


  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once:true }
    );

  } else {

    init();

  }

})();
