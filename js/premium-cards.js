// ECOMAX — Premium Product Cards V3
// Cars run on the actual product-card border, not an inner/offset frame.
// Visual layer only: does not replace cart, checkout or auth logic.

(function () {
  "use strict";

  if (window.__ECOMAX_PREMIUM_CARDS_V3__) return;
  window.__ECOMAX_PREMIUM_CARDS_V2__ = true;

  const css = document.createElement("style");
  css.id = "ecomaxPremiumCardsV3";

  css.textContent = `
    .product-card, .pro-product-card{
      position:relative!important;
      isolation:isolate!important;
      overflow:visible!important;
      border-radius:22px!important;
    }

    /* Disable every previous small/old car system. */
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

    /* Two neon rails around the whole card. */
    .ecomax-perimeter-cars::before{
      content:"";
      position:absolute;
      inset:12px;
      border:2px solid rgba(0,234,255,.58);
      border-radius:32px;
      box-shadow:
        0 0 7px rgba(0,234,255,.95),
        0 0 20px rgba(0,234,255,.52),
        0 0 34px rgba(255,45,154,.28);
      animation:ecomaxTrackGlow 2.4s ease-in-out infinite;
    }

    .ecomax-perimeter-cars::after{
      content:"";
      position:absolute;
      inset:17px;
      border:1px dashed rgba(255,45,154,.52);
      border-radius:27px;
      box-shadow:0 0 12px rgba(255,45,154,.25);
      animation:ecomaxTrackDash 2s linear infinite;
    }

    .ecomax-perimeter-car{
      position:absolute!important;
      width:78px!important;
      height:40px!important;
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      pointer-events:none!important;
      will-change:left,top,transform;
      transform-origin:center center;
    }

    .ecomax-perimeter-car svg{
      display:block!important;
      width:78px!important;
      height:40px!important;
      overflow:visible!important;
      filter:
        drop-shadow(0 0 4px currentColor)
        drop-shadow(0 0 11px currentColor)
        drop-shadow(0 0 22px currentColor);
    }

    .ecomax-perimeter-car.cyan{
      color:#00f6ff;
      /* position is driven by the perimeter runner below */
    }

    .ecomax-perimeter-car.pink{
      color:#ff2d9a;
      /* position is driven by the perimeter runner below */
    }

    /* Cars follow the real rounded card frame; JS calculates the path from the live card size. */

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
        inset:10px;
        border-radius:25px;
      }

      .ecomax-perimeter-cars::after{
        inset:14px;
        border-radius:21px;
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
    const speed = 72; // px/sec
    const inset = 1;
    const radius = 22;
    const started = performance.now();

    function frame(now){
      const w = circuit.clientWidth;
      const h = circuit.clientHeight;
      if (w < 20 || h < 20){
        raf = requestAnimationFrame(frame);
        return;
      }

      const r = Math.min(radius, Math.max(8, Math.min((w - inset*2)/2 - 1, (h - inset*2)/2 - 1)));
      const left = inset + r;
      const right = w - inset - r;
      const top = inset;
      const bottom = h - inset;
      const cxL = left;
      const cxR = right;
      const cyT = top + r;
      const cyB = bottom - r;

      const straightTop = Math.max(0, right-left);
      const straightSide = Math.max(0, cyB-cyT);
      const corner = Math.PI*r/2;
      const perimeter = 2*straightTop + 2*straightSide + 4*corner;

      function pointAt(distance){
        let d = ((distance % perimeter) + perimeter) % perimeter;

        if (d < straightTop)
          return {x:left+d,y:top,angle:0};
        d -= straightTop;

        if (d < corner){
          const a = -Math.PI/2 + d/r;
          return {x:cxR + r*Math.cos(a),y:cyT + r*Math.sin(a),angle:a+Math.PI/2};
        }
        d -= corner;

        if (d < straightSide)
          return {x:right,y:cyT+d,angle:Math.PI/2};
        d -= straightSide;

        if (d < corner){
          const a = d/r;
          return {x:cxR + r*Math.cos(a),y:cyB + r*Math.sin(a),angle:a+Math.PI/2};
        }
        d -= corner;

        if (d < straightTop)
          return {x:right-d,y:bottom,angle:Math.PI};
        d -= straightTop;

        if (d < corner){
          const a = Math.PI/2 + d/r;
          return {x:cxL + r*Math.cos(a),y:cyB + r*Math.sin(a),angle:a+Math.PI/2};
        }
        d -= corner;

        if (d < straightSide)
          return {x:left,y:cyB-d,angle:-Math.PI/2};
        d -= straightSide;

        const a = Math.PI + d/r;
        return {x:cxL + r*Math.cos(a),y:cyT + r*Math.sin(a),angle:a+Math.PI/2};
      }

      const elapsed = (now-started)/1000;
      cars.forEach(car=>{
        if (!car.el) return;
        const direction = car.el.classList.contains("pink") ? -1 : 1;
        const p = pointAt((elapsed*speed*direction) + car.phase*perimeter);
        car.el.style.left = p.x + "px";
        car.el.style.top = p.y + "px";
        car.el.style.transform = "translate(-50%,-50%) rotate("+((p.angle*180/Math.PI)+90)+"deg)";
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