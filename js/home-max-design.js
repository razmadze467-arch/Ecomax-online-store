(() => {
  'use strict';

  const boot = () => {
    if (document.documentElement.dataset.ecomaxMaxDesign === '2') return;
    document.documentElement.dataset.ecomaxMaxDesign = '2';

    const style = document.createElement('style');
    style.id = 'ecomax-max-design-style-v2';

    style.textContent = `
      :root{
        --mx-cyan:#00eaff;
        --mx-blue:#1677ff;
        --mx-violet:#7a55ff;
        --mx-deep:#01060d;
        --mx-glass:rgba(4,18,31,.68);
        --mx-line:rgba(0,234,255,.25);
      }

      body{
        background:
          radial-gradient(
            circle at 82% 12%,
            rgba(0,234,255,.16),
            transparent 24%
          ),
          radial-gradient(
            circle at 18% 32%,
            rgba(20,82,255,.15),
            transparent 30%
          ),
          radial-gradient(
            circle at 50% 75%,
            rgba(122,85,255,.08),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            #01060d 0%,
            #031321 42%,
            #01060d 100%
          ) !important;
      }

      body:before{
        content:"";
        position:fixed;
        inset:0;
        z-index:-1;
        pointer-events:none;
        background-image:
          linear-gradient(
            rgba(0,234,255,.035) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(0,234,255,.035) 1px,
            transparent 1px
          );
        background-size:42px 42px;
        mask-image:linear-gradient(
          #000,
          transparent 92%
        );
      }

      .header{
        background:rgba(1,7,14,.72) !important;
        border-bottom:1px solid rgba(0,234,255,.28) !important;
        box-shadow:
          0 8px 45px rgba(0,0,0,.5),
          0 0 35px rgba(0,234,255,.05) !important;
        backdrop-filter:blur(22px) !important;
      }

      .nav{
        max-width:1480px !important;
        min-height:76px !important;
      }

      .logo{
        display:flex !important;
        flex-direction:column;
        gap:1px;
        line-height:.85;
        letter-spacing:4px;
        font-size:25px !important;
        text-shadow:
          0 0 25px rgba(0,234,255,.22);
      }

      .logo small{
        font-size:6px !important;
        letter-spacing:1.5px;
        color:#8ba8b5;
        font-weight:700;
        margin-top:6px;
        white-space:nowrap;
      }

      .links a{
        font-size:11px !important;
        color:#c7d9e1 !important;
        transition:.25s;
      }

      .links a:hover{
        color:#00eaff !important;
        text-shadow:0 0 12px #00eaff;
      }

      .hero{
        max-width:1480px !important;
        min-height:760px !important;
        padding:60px 22px 70px !important;
        perspective:1400px;
        overflow:hidden;
      }

      .hero:before{
        background-size:38px 38px !important;
        opacity:.8;
        mask-image:
          radial-gradient(
            circle at 55% 40%,
            #000,
            transparent 80%
          ) !important;
      }

      .hero:after{
        content:"";
        position:absolute;
        right:-12%;
        top:2%;
        width:70%;
        height:96%;
        background:
          radial-gradient(
            ellipse,
            rgba(0,234,255,.13),
            transparent 58%
          );
        filter:blur(4px);
        pointer-events:none;
      }

      .hero-copy{
        max-width:750px !important;
        transform:translateZ(35px);
      }

      .eyebrow{
        background:rgba(0,234,255,.035) !important;
        box-shadow:
          0 0 35px rgba(0,234,255,.12),
          inset 0 0 18px rgba(0,234,255,.04) !important;
      }

      h1{
        font-size:clamp(46px,6.5vw,92px) !important;
        line-height:.93 !important;
        letter-spacing:-4px !important;
        text-shadow:
          0 18px 70px rgba(0,0,0,.65) !important;
      }

      h1 span{
        color:#00eaff !important;
        text-shadow:
          0 0 18px rgba(0,234,255,.55),
          0 0 55px rgba(0,234,255,.22) !important;
      }

      .hero-copy>p{
        font-size:15px !important;
        color:#a7bdc8 !important;
        max-width:670px !important;
      }

      .primary{
        box-shadow:
          0 0 35px rgba(0,234,255,.25),
          inset 0 0 18px rgba(255,255,255,.22) !important;
        position:relative;
        overflow:hidden;
      }

      .primary:after{
        content:"";
        position:absolute;
        inset:-50%;
        background:
          linear-gradient(
            110deg,
            transparent 42%,
            rgba(255,255,255,.5) 50%,
            transparent 58%
          );
        animation:mxShine 3.2s linear infinite;
      }

      .hero-visual{
        min-height:570px !important;
        perspective:1600px;
        transform-style:preserve-3d;
      }

      .hero-visual:before{
        content:"";
        position:absolute;
        width:610px;
        height:610px;
        border-radius:50%;
        background:
          radial-gradient(
            circle,
            rgba(0,234,255,.19),
            rgba(20,80,255,.07) 34%,
            transparent 70%
          );
        filter:blur(13px);
        animation:mxPulse 4s ease-in-out infinite;
      }

      .hero-visual:after{
        content:"LVL-CHEMICAL";
        position:absolute;
        z-index:5;
        top:50%;
        left:50%;
        transform:
          translate(-50%,-58%)
          translateZ(170px);
        font-family:Arial,sans-serif;
        font-size:clamp(27px,4vw,52px);
        font-weight:900;
        letter-spacing:5px;
        color:#f8feff;
        white-space:nowrap;
        pointer-events:none;
        text-shadow:
          1px 1px 0 #b9d2dc,
          3px 3px 0 #56717f,
          6px 6px 0 #1d3340,
          0 0 16px #00eaff,
          0 0 42px rgba(0,234,255,.7);
        mix-blend-mode:screen;
        animation:mxLogoFloat 4.5s ease-in-out infinite;
      }

      .halo{
        width:510px !important;
        height:510px !important;
        border:1px solid rgba(0,234,255,.35) !important;
        box-shadow:
          0 0 65px rgba(0,234,255,.18),
          inset 0 0 100px rgba(0,234,255,.06) !important;
        animation:mxOrbit 15s linear infinite;
        transform-style:preserve-3d;
      }

      .halo:before{
        inset:38px !important;
        border-color:rgba(0,234,255,.25) !important;
        transform:
          rotateX(67deg)
          rotateZ(25deg) !important;
        box-shadow:
          0 0 22px rgba(0,234,255,.12);
      }

      .halo:after{
        inset:88px !important;
        border-color:rgba(122,85,255,.3) !important;
        transform:
          rotateY(62deg)
          rotateZ(-35deg) !important;
        box-shadow:
          0 0 25px rgba(122,85,255,.12);
      }

      .hero-bottle{
        width:225px !important;
        height:375px !important;
        transform:
          translateZ(70px)
          rotateY(-12deg)
          rotate(2deg) !important;
        background:
          linear-gradient(
            90deg,
            #020508,
            #0b1e2b 15%,
            #07131d 32%,
            #1c5d75 51%,
            #07131f 70%,
            #020507
          ) !important;
        box-shadow:
          inset 20px 0 30px rgba(255,255,255,.1),
          inset -24px 0 34px rgba(0,0,0,.85),
          0 50px 120px rgba(0,0,0,.72),
          0 0 110px rgba(0,234,255,.28) !important;
        animation:mxBottle 5.5s ease-in-out infinite;
        transform-style:preserve-3d;
      }

      .hero-bottle:before{
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        background:
          linear-gradient(
            115deg,
            transparent 22%,
            rgba(255,255,255,.17) 34%,
            transparent 43%
          );
        mix-blend-mode:screen;
        pointer-events:none;
        animation:mxReflection 3.4s linear infinite;
      }

      .hero-bottle:after{
        content:"";
        position:absolute;
        left:12px;
        right:12px;
        bottom:-24px;
        height:35px;
        border-radius:50%;
        background:
          radial-gradient(
            ellipse,
            rgba(0,234,255,.32),
            transparent 68%
          );
        filter:blur(8px);
        pointer-events:none;
      }

      .hero-cap{
        box-shadow:
          0 0 18px rgba(0,234,255,.14) !important;
      }

      .hero-label{
        left:12px !important;
        right:12px !important;
        top:80px !important;
        height:205px !important;
        border-radius:19px !important;
        background:
          linear-gradient(
            145deg,
            rgba(7,24,36,.96),
            rgba(2,10,17,.98)
          ) !important;
        border:1px solid rgba(0,234,255,.78) !important;
        box-shadow:
          0 0 42px rgba(0,234,255,.2),
          inset 0 0 35px rgba(0,234,255,.09) !important;
        transform:translateZ(28px);
        overflow:hidden;
      }

      .hero-label:after{
        content:"";
        position:absolute;
        inset:-40%;
        background:
          linear-gradient(
            120deg,
            transparent 40%,
            rgba(0,234,255,.16) 48%,
            transparent 56%
          );
        animation:mxLabelSweep 3s linear infinite;
      }

      .hero-label b{
        font-size:20px !important;
        letter-spacing:4px !important;
        color:#fff !important;
        text-shadow:
          0 0 16px rgba(255,255,255,.5) !important;
        z-index:2;
      }

      .hero-label span{
        font-size:9px !important;
        letter-spacing:3px !important;
        color:#00eaff !important;
        z-index:2;
      }

      .hero-label strong{
        font-size:42px !important;
        z-index:2;
        text-shadow:
          0 0 28px rgba(0,234,255,.65) !important;
      }

      .float{
        backdrop-filter:blur(14px) !important;
        background:rgba(2,12,22,.74) !important;
        box-shadow:
          0 0 32px rgba(0,234,255,.12),
          0 20px 50px rgba(0,0,0,.5) !important;
        animation:mxFloat 4s ease-in-out infinite;
      }

      .float.one{
        top:50px;
        left:-1%;
        animation-delay:-1s;
      }

      .float.two{
        right:-2px;
        top:190px;
        animation-delay:-2s;
      }

      .float.three{
        bottom:35px;
        left:5%;
        animation-delay:-3s;
      }

      .metrics{
        margin-top:42px !important;
      }

      .metric strong{
        text-shadow:
          0 0 20px rgba(255,255,255,.16);
      }

      .section{
        max-width:1480px !important;
        position:relative;
      }

      .section[id="products"]{
        border-top:1px solid rgba(0,234,255,.15);
        background:
          radial-gradient(
            ellipse at 50% 0%,
            rgba(0,234,255,.045),
            transparent 55%
          );
      }

      .section-head{
        position:relative;
      }

      .section-head:after{
        content:"";
        position:absolute;
        left:0;
        bottom:-15px;
        width:160px;
        height:1px;
        background:
          linear-gradient(
            90deg,
            #00eaff,
            transparent
          );
        box-shadow:
          0 0 12px #00eaff;
      }

      /* =========================================
         ECOMAX PRODUCT CARD CARS
         ========================================= */

      .product-card > .ecomax-real-card-cars,
      .card > .ecomax-real-card-cars{
        z-index:999999 !important;
      }

      .product-card > .ecomax-real-card-cars,
      .card > .ecomax-real-card-cars{
        position:absolute !important;
        left:8px !important;
        right:8px !important;
        top:165px !important;
        bottom:auto !important;
        height:58px !important;
        z-index:99999 !important;
        display:block !important;
        visibility:visible !important;
        opacity:1 !important;
        pointer-events:none !important;
        overflow:visible !important;
        animation-play-state:running !important;
      }

      .ecomax-real-car{
        position:absolute !important;
        width:70px !important;
        height:30px !important;
        display:block !important;
        visibility:visible !important;
        opacity:1 !important;
        color:#00eaff !important;
        filter:
          drop-shadow(
            0 0 8px currentColor
          ) !important;
        animation-play-state:running !important;
        will-change:left,right;
      }

      .ecomax-real-car.car-a{
        left:8px !important;
        top:4px !important;
        animation:mxCardCarA 6s linear infinite !important;
      }

      .ecomax-real-car.car-b{
        right:8px !important;
        bottom:2px !important;
        color:#ff2d9a !important;
        transform:scaleX(-1) !important;
        animation:mxCardCarB 6.8s linear infinite !important;
      }

      .ecomax-real-car .rc-body{
        position:absolute;
        left:4px;
        right:4px;
        bottom:5px;
        height:13px;
        border:2px solid currentColor;
        border-radius:
          7px 10px 4px 4px;
        background:
          linear-gradient(
            180deg,
            rgba(0,234,255,.18),
            rgba(1,8,15,.96)
          );
        box-shadow:
          0 0 8px currentColor;
      }

      .ecomax-real-car .rc-body:before{
        content:"";
        position:absolute;
        left:15px;
        top:-8px;
        width:25px;
        height:8px;
        border:2px solid currentColor;
        border-bottom:0;
        border-radius:
          8px 9px 0 0;
      }

      .ecomax-real-car i{
        position:absolute;
        bottom:1px;
        width:7px;
        height:7px;
        border:2px solid #fff;
        border-radius:50%;
        background:#02060b;
      }

      .ecomax-real-car i:first-of-type{
        left:12px;
      }

      .ecomax-real-car i:last-of-type{
        right:12px;
      }

      @media(max-width:620px){

        .ecomax-real-card-cars{
          top:140px !important;
          bottom:auto !important;
          height:48px !important;
        }

        .ecomax-real-car{
          width:58px !important;
          height:25px !important;
        }

        .ecomax-real-car.car-a{
          left:4px !important;
        }

        .ecomax-real-car.car-b{
          right:4px !important;
        }

      }

      /* =========================================
         PRODUCT CARDS
         ========================================= */

      .card{
        transform-style:preserve-3d;
        background:
          linear-gradient(
            145deg,
            rgba(7,30,46,.9),
            rgba(1,8,14,.98)
          ) !important;
        border-color:
          rgba(0,234,255,.24) !important;
        box-shadow:
          0 28px 75px rgba(0,0,0,.4),
          inset 0 1px 0 rgba(255,255,255,.045) !important;
        transition:
          transform .25s ease,
          box-shadow .25s ease,
          border-color .25s ease;
      }

      .card:hover{
        transform:
          translateY(-9px)
          rotateX(1deg)
          rotateY(-1deg) !important;
        border-color:
          rgba(0,234,255,.6) !important;
        box-shadow:
          0 38px 100px rgba(0,0,0,.58),
          0 0 45px rgba(0,234,255,.11) !important;
      }

      .card:after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          linear-gradient(
            115deg,
            transparent 35%,
            rgba(255,255,255,.04) 50%,
            transparent 65%
          );
        transform:translateX(-110%);
        transition:transform .7s;
      }

      .card:hover:after{
        transform:translateX(110%);
      }

      .bottle-body{
        box-shadow:
          inset 10px 0 18px rgba(255,255,255,.1),
          inset -15px 0 22px rgba(0,0,0,.8),
          0 28px 48px rgba(0,0,0,.65) !important;
        transform:translateZ(22px);
        transition:.3s;
      }

      .card:hover .bottle-body{
        transform:
          translateZ(42px)
          rotateY(-4deg);
      }

      .new-add-cart{
        box-shadow:
          0 0 18px rgba(0,234,255,.08);
        transition:.25s;
      }

      .new-add-cart:hover{
        box-shadow:
          0 0 28px rgba(0,234,255,.22);
        transform:translateY(-2px);
      }

      .footer{
        background:
          rgba(1,5,10,.88) !important;
        border-top-color:
          rgba(0,234,255,.25) !important;
      }

      /* =========================================
         ANIMATIONS
         ========================================= */

      @keyframes mxCardCarA{
        0%{left:8px;opacity:1}
        8%{opacity:1}
        50%{left:calc(100% - 78px);opacity:1}
        92%{opacity:1}
        100%{left:8px;opacity:1}
      }

      @keyframes mxCardCarB{
        0%{right:8px;opacity:1}
        8%{opacity:1}
        50%{right:calc(100% - 78px);opacity:1}
        92%{opacity:1}
        100%{right:8px;opacity:1}
      }

      @keyframes mxBottle{
        0%,100%{
          transform:
            translateZ(70px)
            rotateY(-12deg)
            rotate(2deg)
            translateY(0);
        }

        50%{
          transform:
            translateZ(95px)
            rotateY(8deg)
            rotate(-2deg)
            translateY(-12px);
        }
      }

      @keyframes mxOrbit{
        to{
          transform:rotate(360deg);
        }
      }

      @keyframes mxFloat{
        0%,100%{
          translate:0 0;
        }

        50%{
          translate:0 -9px;
        }
      }

      @keyframes mxPulse{
        0%,100%{
          opacity:.7;
          scale:1;
        }

        50%{
          opacity:1;
          scale:1.06;
        }
      }

      @keyframes mxLogoFloat{
        0%,100%{
          transform:
            translate(-50%,-58%)
            translateZ(170px)
            rotateY(-2deg);
        }

        50%{
          transform:
            translate(-50%,-64%)
            translateZ(205px)
            rotateY(3deg);
        }
      }

      @keyframes mxShine{
        0%{
          transform:
            translateX(-90%)
            rotate(10deg);
        }

        100%{
          transform:
            translateX(90%)
            rotate(10deg);
        }
      }

      @keyframes mxReflection{
        0%{
          transform:translateX(-120%);
        }

        100%{
          transform:translateX(120%);
        }
      }

      @keyframes mxLabelSweep{
        0%{
          transform:
            translateX(-55%)
            rotate(8deg);
        }

        100%{
          transform:
            translateX(55%)
            rotate(8deg);
        }
      }

      /* =========================================
         TABLET
         ========================================= */

      @media(max-width:950px){

        .hero{
          min-height:auto !important;
          padding-top:45px !important;
        }

        .hero-visual{
          min-height:510px !important;
        }

        .hero-visual:after{
          font-size:34px;
        }

        .halo{
          width:440px !important;
          height:440px !important;
        }

        .nav{
          min-height:68px !important;
        }

      }

      /* =========================================
         MOBILE
         ========================================= */

      @media(max-width:620px){

        .nav{
          min-height:62px !important;
        }

        .logo{
          font-size:20px !important;
        }

        .logo small{
          font-size:5px !important;
        }

        .hero{
          padding:35px 15px 30px !important;
        }

        .hero h1{
          font-size:42px !important;
          letter-spacing:-2px !important;
        }

        .hero-visual{
          min-height:410px !important;
        }

        .halo{
          width:315px !important;
          height:315px !important;
        }

        .hero-bottle{
          width:165px !important;
          height:280px !important;
          transform:
            translateZ(45px)
            rotateY(-8deg) !important;
        }

        .hero-label{
          top:60px !important;
          height:150px !important;
        }

        .hero-label strong{
          font-size:30px !important;
        }

        .hero-visual:after{
          font-size:21px;
          letter-spacing:2px;
          transform:
            translate(-50%,-58%)
            translateZ(110px);
        }

        .float{
          font-size:8px !important;
          padding:8px 10px !important;
        }

        .float.one{
          top:38px;
        }

        .float.two{
          top:155px;
        }

        .float.three{
          bottom:18px;
        }

        .metrics{
          gap:18px !important;
        }

      }

      /* =========================================
         REDUCED MOTION
         ========================================= */

      @media(prefers-reduced-motion:reduce){

        *,
        *:before,
        *:after{
          animation:none !important;
          transition:none !important;
        }

      }
    `;

    document.head.appendChild(style);

    /* =========================================
       LOGO
       ========================================= */

    const logo = document.querySelector('.logo');

    if (logo) {
      logo.innerHTML =
        'ECO<span>MAX</span>' +
        '<small>' +
        'შპს ეკო-მაქსი • LVL-CHEMICAL • ' +
        'PROFESSIONAL AUTOMOTIVE CARE' +
        '</small>';

      logo.setAttribute(
        'aria-label',
        'შპს ეკო-მაქსი • LVL-CHEMICAL'
      );
    }

    /* =========================================
       HERO LABEL
       ========================================= */

    const heroLabel =
      document.querySelector('.hero-label');

    if (heroLabel) {
      heroLabel.innerHTML =
        '<b>LVL-CHEMICAL</b>' +
        '<span>' +
        'ECOMAX • PROFESSIONAL CHEMICAL SYSTEM' +
        '</span>' +
        '<strong>5 L</strong>';
    }

    /* =========================================
       EYEBROW
       ========================================= */

    const eyebrow =
      document.querySelector('.eyebrow');

    if (eyebrow) {
      eyebrow.innerHTML =
        '<i class="dot"></i> ' +
        'LVL-CHEMICAL • ECOMAX • PREMIUM CARE';
    }

    /* =========================================
       HERO TEXT
       ========================================= */

    const heroText =
      document.querySelector('.hero-copy > p');

    if (heroText) {
      heroText.textContent =
        'შპს ეკო-მაქსი — LVL-CHEMICAL-ის ' +
        'პროფესიონალური ავტოქიმია ავტომობილის ' +
        'მოვლისა და წმენდისთვის. ხარისხი, ' +
        'ეფექტურობა და პროფესიონალური შედეგი ' +
        'ერთ სისტემაში.';
    }

    /* =========================================
       HERO TITLE
       ========================================= */

    const title =
      document.querySelector('h1');

    if (title) {
      title.innerHTML =
        'სუფთა მანქანა.<br>' +
        '<span>პროფესიონალური</span><br>' +
        'შედეგი.';
    }

    /* =========================================
       FOOTER
       ========================================= */

    const footer =
      document.querySelector('.footer');

    if (footer) {
      footer.innerHTML =
        '© 2026 ' +
        '<strong>შპს ეკო-მაქსი</strong> — ' +
        '<strong>LVL-CHEMICAL</strong> • ' +
        'ყველა უფლება დაცულია';
    }

    /* =========================================
       ECOMAX CARD CARS
       Attach cars directly to actual .card
       elements rendered on the page.
       ========================================= */

    const addCardCars = (card, index) => {

      if (
        card.querySelector(
          '.ecomax-real-card-cars'
        )
      ) {
        return;
      }

      const wrap =
        document.createElement('div');

      wrap.className =
        'ecomax-real-card-cars';

      wrap.setAttribute(
        'aria-hidden',
        'true'
      );

      wrap.innerHTML =
        '<div class="ecomax-real-car car-a">' +
          '<span class="rc-body"></span>' +
          '<i></i>' +
          '<i></i>' +
        '</div>' +

        '<div class="ecomax-real-car car-b">' +
          '<span class="rc-body"></span>' +
          '<i></i>' +
          '<i></i>' +
        '</div>';

      const visual = card.querySelector('.product-visual');
      card.appendChild(wrap);
    };

    document
      .querySelectorAll('.card,.product-card')
      .forEach(addCardCars);

    const cardGrid =
      document.querySelector('#productsGrid') ||
      document.querySelector('.products-grid');

    if (
      cardGrid &&
      'MutationObserver' in window
    ) {

      const mo =
        new MutationObserver(() => {
          document
            .querySelectorAll('.card,.product-card')
            .forEach(addCardCars);
        });

      mo.observe(
        cardGrid,
        {
          childList:true
        }
      );
    }

    // Hard-mount fallback: product cards can be rendered/replaced after
    // the initial boot. Retry a few times so the cars appear even when
    // another script rebuilds the grid after page load.
    const remountCardCars = () => {
      document
        .querySelectorAll('.card,.product-card')
        .forEach((card, index) => addCardCars(card, index));
    };
    remountCardCars();
    [120, 500, 1200, 2200].forEach(delay => {
      window.setTimeout(remountCardCars, delay);
    });

    /* =========================================
       PRODUCT CARD 3D MOVEMENT
       ========================================= */

    document
      .querySelectorAll('.card,.product-card')
      .forEach((card, index) => {

        card.style.setProperty(
          '--mx-index',
          index
        );

        card.addEventListener(
          'pointermove',
          e => {

            if (
              window.matchMedia(
                '(prefers-reduced-motion: reduce)'
              ).matches
            ) {
              return;
            }

            const r =
              card.getBoundingClientRect();

            const x =
              (e.clientX - r.left) /
              r.width - .5;

            const y =
              (e.clientY - r.top) /
              r.height - .5;

            card.style.transform =
              `translateY(-8px) ` +
              `rotateX(${(-y * 3).toFixed(2)}deg) ` +
              `rotateY(${(x * 3).toFixed(2)}deg)`;
          }
        );

        card.addEventListener(
          'pointerleave',
          () => {
            card.style.transform = '';
          }
        );

      });
  };

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      boot,
      {once:true}
    );
  } else {
    boot();
  }

})();
