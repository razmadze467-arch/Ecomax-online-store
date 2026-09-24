/* =========================================================
   ECOMAX — PREMIUM CARD PERIMETER CARS
   Version: 2026-09-23-DUAL-CARS-EXACT-TRACK
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
      overflow:visible !important;
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

      width:26px !important;
      height:13px !important;

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
        width:24px !important;
        height:12px !important;
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

    const color = type === "pink" ? "#ff2d9a" : "#00eaff";
    const glow = type === "pink" ? "#ff5ab8" : "#55f6ff";

    return `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 120 54"
           preserveAspectRatio="xMidYMid meet"
           aria-hidden="true">

        <defs>
          <filter id="carGlow-${type}" x="-40%" y="-60%" width="180%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="carBody-${type}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${glow}" stop-opacity=".95"/>
            <stop offset=".55" stop-color="${color}" stop-opacity=".65"/>
            <stop offset="1" stop-color="#06101b" stop-opacity=".98"/>
          </linearGradient>
        </defs>

        <g filter="url(#carGlow-${type})">
          <!-- sleek futuristic car body -->
          <path d="M8 36 L13 28 Q17 25 30 24 L43 12 Q47 8 58 8 H79 Q86 8 91 13 L102 24 Q109 25 113 30 L115 36 Q114 41 109 41 H13 Q8 41 8 36Z"
                fill="url(#carBody-${type})"
                stroke="${color}" stroke-width="2.2"
                stroke-linejoin="round"/>

          <!-- windows -->
          <path d="M45 12 L58 12 V23 H35 Z"
                fill="#061522" stroke="${color}" stroke-width="1.2"/>
          <path d="M62 12 H78 Q84 12 88 17 L94 23 H62 Z"
                fill="#061522" stroke="${color}" stroke-width="1.2"/>

          <!-- light strip -->
          <path d="M15 31 H102" stroke="${glow}" stroke-width="1.2" opacity=".75"/>
          <path d="M101 28 L111 31" stroke="#fff" stroke-width="2" stroke-linecap="round"/>

          <!-- wheels -->
          <circle cx="29" cy="40" r="8" fill="#02060b" stroke="${color}" stroke-width="2"/>
          <circle cx="29" cy="40" r="3" fill="${glow}"/>
          <circle cx="88" cy="40" r="8" fill="#02060b" stroke="${color}" stroke-width="2"/>
          <circle cx="88" cy="40" r="3" fill="${glow}"/>

          <!-- underglow -->
          <path d="M19 47 H98" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        </g>
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

    /* Match the exact radius used by the visible neon frame. */
    const radius = window.innerWidth <= 700 ? 18 : 22;
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

    /*
      The car must ride the OUTER edge of the visible card frame.
      The frame itself is at the card edge, so use a tiny negative
      inset and enlarge the track by the same amount.
    */
    const inset = -1.5;

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

  function startPerimeterAnimation(card, cyan) {

    const speed = 58;
    const started = performance.now();

    function place(el, pt) {
      el.style.setProperty("left", pt.x + "px", "important");
      el.style.setProperty("top", pt.y + "px", "important");
      el.style.setProperty(
        "transform",
        "translate(-50%, -50%) rotate(" + pt.angle + "rad)",
        "important"
      );
    }

    function frame(now) {
      if (!card.isConnected) return;
      const rect = card.getBoundingClientRect();
      if (rect.width < 30 || rect.height < 30) {
        requestAnimationFrame(frame);
        return;
      }
      const perimeter = pointAt(card, 0).length;
      const travel = (((now - started) / 1000) * speed) % perimeter;
      place(cyan, pointAt(card, travel));
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
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
