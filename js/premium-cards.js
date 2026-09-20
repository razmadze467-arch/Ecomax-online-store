// ECOMAX — Premium Product Cards V5
// Cars run on the actual product-card border, not an inner/offset frame.
// Visual layer only: does not replace cart, checkout or auth logic.

(function () {
  "use strict";

  if (window.__ECOMAX_PREMIUM_CARDS_V5__) return;
  window.__ECOMAX_PREMIUM_CARDS_V4__ = true;

  const css = document.createElement("style");
  css.id = "ecomaxPremiumCardsV5";

  css.textContent = `
    .product-card, .pro-product-card{
      position:relative!important;
      isolation:isolate!important;
      overflow:visible!important;
      border-radius:22px!important;
    }

    /* Disable every previous small/old car system. */
    .ecomax-orbit-cars,
    .ecomax-static-cars,
    .ecomax-card-cars,
    .ecomax-static-car,
    .ecomax-mini-car,
    .ecomax-card-road{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
    }

    /* Full-card circuit container. */
    .ecomax-perimeter-cars{
      position:absolute!important;
      inset:0!important;
      z-index:999999!important;
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      pointer-events:none!important;
      overflow:visible!important;
    }

    /* ONE race rail exactly on the product-card frame. */
    .ecomax-perimeter-cars::before{
      content:"";
      position:absolute;
      inset:0;
      border:2px solid rgba(0,234,255,.78);
      border-radius:22px;
      box-shadow:
        0 0 7px rgba(0,234,255,1),
        0 0 18px rgba(0,234,255,.65),
        0 0 30px rgba(255,45,154,.30);
      animation:ecomaxTrackGlow 2.2s ease-in-out infinite;
      box-sizing:border-box;
    }

    .ecomax-perimeter-cars::after{
      content:"";
      position:absolute;
      inset:0;
      border:1px solid rgba(255,45,154,.35);
      border-radius:22px;
      box-sizing:border-box;
      pointer-events:none;
    }

    @keyframes ecomaxTrackGlow{
      0%,100%{opacity:.62}
      50%{opacity:1}
    }

    @keyframes ecomaxTrackDash{
      to{transform:rotate(360deg)}
    }

    /* Keep existing card contents above decorative layers. */
    .product-card > *:not(.ecomax-perimeter-cars), .pro-product-card > *:not(.ecomax-perimeter-cars){
      position:relative;
      z-index:2;
    }

    @media(max-width:700px){
      .product-card, .pro-product-card{
        border-radius:18px!important;
      }

      .ecomax-perimeter-cars{
        inset:0!important;
      }

      .ecomax-perimeter-cars::before{
        inset:0;
        border-radius:18px;
      }

      .ecomax-perimeter-cars::after{
        inset:0;
        border-radius:18px;
      }

      .ecomax-perimeter-car{
        width:58px!important;
        height:32px!important;
      }

      .ecomax-perimeter-car svg{
        width:58px!important;
        height:32px!important;
      }
    }

    @media(max-width:400px){
      .ecomax-perimeter-cars{
        inset:0!important;
      }

      .ecomax-perimeter-car{
        width:50px!important;
        height:28px!important;
      }

      .ecomax-perimeter-car svg{
        width:50px!important;
        height:28px!important;
      }
    }

    @media(prefers-reduced-motion:reduce){
      .ecomax-perimeter-car,
      .ecomax-perimeter-cars::before,
      .ecomax-perimeter-cars::after{
        animation:none!important;
      }
    }
  `;

  (document.head || document.documentElement).appendChild(css);

  function carSVG(type){
    const pink = type === "pink";
    const body = pink ? "rgba(28,3,18,.98)" : "rgba(3,18,27,.98)";
    const glass = pink ? "rgba(255,45,154,.22)" : "rgba(0,246,255,.22)";

    return `
      <svg viewBox="0 0 164 84" aria-hidden="true" focusable="false">
        <path d="M14 52H150c6 0 9-4 9-9v-6h-20l-17-20H61L43 37H14C8 37 4 42 4 47v2c0 2 2 3 5 3Z"
          fill="${body}" stroke="currentColor" stroke-width="4"/>
        <path d="M55 36h62l-13-15H68Z"
          fill="${glass}" stroke="currentColor" stroke-width="3"/>
        <path d="M87 22v13" stroke="currentColor" stroke-width="2"/>
        <path d="M150 32h8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <path d="M8 43h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <circle cx="43" cy="55" r="12" fill="#03080d" stroke="#fff" stroke-width="3"/>
        <circle cx="122" cy="55" r="12" fill="#03080d" stroke="#fff" stroke-width="3"/>
        <circle cx="43" cy="55" r="4" fill="currentColor"/>
        <circle cx="122" cy="55" r="4" fill="currentColor"/>
        <path d="M28 65h110" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      </svg>
    `;
  }

  function addCircuit(card){
    if (!card || card.querySelector(".ecomax-perimeter-cars")) return;

    const circuit = document.createElement("div");
    circuit.className = "ecomax-perimeter-cars";
    circuit.setAttribute("aria-hidden","true");

    const cyan = document.createElement("div");
    cyan.className = "ecomax-perimeter-car cyan";
    cyan.innerHTML = carSVG("cyan");

    const pink = document.createElement("div");
    pink.className = "ecomax-perimeter-car pink";
    pink.innerHTML = carSVG("pink");

    circuit.appendChild(cyan);
    circuit.appendChild(pink);
    card.appendChild(circuit);
  }

  function runPerimeter(card){
    const circuit = card && card.querySelector(".ecomax-perimeter-cars");
    if (!circuit || circuit.dataset.runnerStarted) return;
    circuit.dataset.runnerStarted = "1";

    const cars = [
      { el: circuit.querySelector(".ecomax-perimeter-car.cyan"), phase: 0 },
      { el: circuit.querySelector(".ecomax-perimeter-car.pink"), phase: .5 }
    ];

    let raf = 0;
    const speed = 55; // px/sec
    const inset = 1;
    const radius = 22;
    const started = performance.now();

    function frame(now){
      const w = circuit.clientWidth;
      const h = circuit.clientHeight;

      if (w < 40 || h < 40){
        raf = requestAnimationFrame(frame);
        return;
      }

      /*
       * True rounded-rectangle track:
       * the car center follows the exact centerline of the card border.
       * No diagonal shortcuts, no inner orbit, no jumping at corners.
       */
      const cs = getComputedStyle(card);
      const cardRadius = parseFloat(cs.borderTopLeftRadius) || 22;

      const x0 = 1;
      const y0 = 1;
      const x1 = w - 1;
      const y1 = h - 1;

      const maxR = Math.min((x1-x0)/2, (y1-y0)/2);
      const r = Math.min(cardRadius, Math.max(6, maxR - 1));

      const topY = y0;
      const rightX = x1;
      const bottomY = y1;
      const leftX = x0;

      const cxL = leftX + r;
      const cxR = rightX - r;
      const cyT = topY + r;
      const cyB = bottomY - r;

      const topLen = Math.max(0, cxR - cxL);
      const sideLen = Math.max(0, cyB - cyT);
      const cornerLen = Math.PI * r / 2;
      const perimeter = 2 * topLen + 2 * sideLen + 4 * cornerLen;

      function pointAt(distance){
        let d = ((distance % perimeter) + perimeter) % perimeter;

        // TOP — left to right
        if (d < topLen){
          return {
            x: cxL + d,
            y: topY,
            angle: 0
          };
        }
        d -= topLen;

        // TOP-RIGHT rounded corner
        if (d < cornerLen){
          const a = -Math.PI/2 + d/r;
          return {
            x: cxR + r*Math.cos(a),
            y: cyT + r*Math.sin(a),
            angle: a + Math.PI/2
          };
        }
        d -= cornerLen;

        // RIGHT — top to bottom
        if (d < sideLen){
          return {
            x: rightX,
            y: cyT + d,
            angle: Math.PI/2
          };
        }
        d -= sideLen;

        // BOTTOM-RIGHT rounded corner
        if (d < cornerLen){
          const a = d/r;
          return {
            x: cxR + r*Math.cos(a),
            y: cyB + r*Math.sin(a),
            angle: a + Math.PI/2
          };
        }
        d -= cornerLen;

        // BOTTOM — right to left
        if (d < topLen){
          return {
            x: cxR - d,
            y: bottomY,
            angle: Math.PI
          };
        }
        d -= topLen;

        // BOTTOM-LEFT rounded corner
        if (d < cornerLen){
          const a = Math.PI/2 + d/r;
          return {
            x: cxL + r*Math.cos(a),
            y: cyB + r*Math.sin(a),
            angle: a + Math.PI/2
          };
        }
        d -= cornerLen;

        // LEFT — bottom to top
        if (d < sideLen){
          return {
            x: leftX,
            y: cyB - d,
            angle: -Math.PI/2
          };
        }
        d -= sideLen;

        // TOP-LEFT rounded corner
        const a = Math.PI + d/r;
        return {
          x: cxL + r*Math.cos(a),
          y: cyT + r*Math.sin(a),
          angle: a + Math.PI/2
        };
      }

      const elapsed = (now - started) / 1000;

      cars.forEach(car => {
        if (!car.el) return;

        const direction =
          car.el.classList.contains("pink") ? -1 : 1;

        const p = pointAt(
          elapsed * speed * direction +
          car.phase * perimeter
        );

        car.el.style.left = p.x + "px";
        car.el.style.top = p.y + "px";

        // Keep the car tangent to the track while it rounds corners.
        car.el.style.transform =
          "translate(-50%,-50%) rotate(" +
          ((p.angle * 180 / Math.PI) + 90) +
          "deg)";
      });

      raf = requestAnimationFrame(frame);
    }
    const stop = () => {
      if (document.hidden){
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener("resize", stop, {passive:true});
    document.addEventListener("visibilitychange", stop, {passive:true});
    raf = requestAnimationFrame(frame);
  }

  function enhance(card){
    if (!card) return;
    addCircuit(card);
    runPerimeter(card);
  }

  function scan(){
    document.querySelectorAll(".product-card, .pro-product-card").forEach(enhance);
  }

  function start(){
    scan();

    const root =
      document.getElementById("productsGrid") ||
      document.querySelector(".products-grid") ||
      document.querySelector(".grid");

    if (root && "MutationObserver" in window && !root.dataset.ecomaxCircuitObserver){
      root.dataset.ecomaxCircuitObserver = "1";

      let timer = 0;
      const observer = new MutationObserver(function(){
        clearTimeout(timer);
        timer = setTimeout(scan, 120);
      });

      observer.observe(root,{childList:true,subtree:true});
    }
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  } else {
    start();
  }

  setTimeout(scan,500);
  setTimeout(scan,1500);
  setTimeout(scan,3000);
})();