(() => {
  'use strict';
  const boot = () => {
    if (document.documentElement.dataset.ecomaxMaxDesign === '1') return;
    document.documentElement.dataset.ecomaxMaxDesign = '1';

    const style = document.createElement('style');
    style.id = 'ecomax-max-design-style';
    style.textContent = `
      :root{
        --mx-cyan:#00eaff;--mx-blue:#168dff;--mx-deep:#020812;--mx-panel:rgba(5,18,31,.78);
      }
      body{background:
        radial-gradient(ellipse at 72% 17%,rgba(0,234,255,.12),transparent 22%),
        radial-gradient(ellipse at 15% 40%,rgba(0,103,255,.12),transparent 30%),
        linear-gradient(180deg,#020812 0%,#041526 38%,#020812 100%);
      }
      .header{background:rgba(1,8,17,.82)!important;border-bottom:1px solid rgba(0,234,255,.25)!important;box-shadow:0 8px 40px rgba(0,0,0,.3)}
      .nav{max-width:1440px;min-height:78px}
      .logo{display:flex!important;flex-direction:column;gap:0;line-height:.9;letter-spacing:3px;font-size:25px;text-shadow:0 0 22px rgba(0,234,255,.14)}
      .logo small{font-size:7px;letter-spacing:1.8px;color:#7f9eab;font-weight:700;margin-top:5px}
      .links a{font-size:11px;color:#c0d2da}
      .hero{max-width:1440px;min-height:720px;padding-top:55px;overflow:hidden}
      .hero:after{content:"";position:absolute;right:-18%;top:8%;width:65%;height:90%;background:radial-gradient(ellipse,rgba(0,234,255,.12),transparent 55%);pointer-events:none}
      .hero-copy{max-width:720px}
      .eyebrow{background:rgba(0,234,255,.045);box-shadow:0 0 24px rgba(0,234,255,.08)}
      h1{font-size:clamp(46px,6.3vw,88px)!important;line-height:.94!important;text-shadow:0 12px 55px rgba(0,0,0,.55)}
      h1 span{text-shadow:0 0 38px rgba(0,234,255,.35)!important}
      .hero-copy>p{font-size:15px;max-width:650px;color:#a1b5c0}
      .primary{box-shadow:0 0 35px rgba(0,234,255,.18),inset 0 0 16px rgba(255,255,255,.18)}
      .hero-visual{min-height:540px;perspective:1200px}
      .hero-visual:before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(0,234,255,.18),rgba(0,103,255,.06) 35%,transparent 70%);filter:blur(10px)}
      .halo{width:470px!important;height:470px!important;border-color:rgba(0,234,255,.28)!important;box-shadow:0 0 55px rgba(0,234,255,.13),inset 0 0 80px rgba(0,234,255,.05)!important;animation:mxOrbit 12s linear infinite}
      .halo:before{inset:32px!important;border-color:rgba(0,234,255,.2)!important;transform:rotate(50deg) skewX(14deg)!important}
      .halo:after{inset:78px!important;border-color:rgba(85,115,255,.22)!important;transform:rotate(-42deg) skewX(15deg)!important}
      .hero-bottle{width:220px!important;height:360px!important;transform:rotateY(-9deg) rotate(2deg)!important;background:linear-gradient(90deg,#03070b,#0d202e 17%,#07131f 36%,#1c5a73 58%,#07121c 73%,#020609)!important;box-shadow:inset 18px 0 28px rgba(255,255,255,.09),inset -22px 0 30px rgba(0,0,0,.82),0 40px 100px rgba(0,0,0,.65),0 0 90px rgba(0,234,255,.22)!important;animation:mxBottle 5s ease-in-out infinite}
      .hero-bottle:after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(115deg,transparent 25%,rgba(255,255,255,.15) 35%,transparent 43%);mix-blend-mode:screen;pointer-events:none}
      .hero-label{left:14px!important;right:14px!important;top:82px!important;height:190px!important;border-radius:18px!important;background:radial-gradient(circle at 50% 25%,#123a50,#06121d 65%)!important;border:1px solid rgba(0,234,255,.7)!important;box-shadow:0 0 35px rgba(0,234,255,.18),inset 0 0 28px rgba(0,234,255,.07)!important}
      .hero-label b{font-size:18px!important;letter-spacing:4px!important;color:#f5fbff;text-shadow:0 0 15px rgba(255,255,255,.35)}
      .hero-label span{font-size:9px!important;letter-spacing:3px!important;color:var(--mx-cyan)!important}
      .hero-label strong{font-size:40px!important;letter-spacing:2px;text-shadow:0 0 24px rgba(0,234,255,.45)}
      .hero-visual:after{content:"LVL";position:absolute;z-index:3;font-size:54px;font-weight:900;letter-spacing:7px;color:#fff;top:50%;left:50%;transform:translate(-50%,-62%) translateZ(70px);pointer-events:none;text-shadow:1px 1px 0 #8ba1ae,3px 3px 0 #3c5664,6px 6px 0 #172a35,0 0 28px rgba(0,234,255,.8),0 0 70px rgba(0,234,255,.35);opacity:.96}
      .float{backdrop-filter:blur(10px);box-shadow:0 0 28px rgba(0,234,255,.1),0 18px 45px rgba(0,0,0,.4)!important}
      .float.one{top:58px;left:0}.float.two{right:-5px;top:190px}.float.three{bottom:45px;left:5%}
      .metrics{margin-top:40px}.metric strong{font-size:23px;text-shadow:0 0 18px rgba(255,255,255,.14)}
      .section{max-width:1440px}
      .section[id="products"]{position:relative}.section[id="products"]:before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,234,255,.5),transparent)}
      .card{background:linear-gradient(145deg,rgba(7,29,43,.94),rgba(2,9,16,.98))!important;border-color:rgba(0,234,255,.24)!important;box-shadow:0 25px 70px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.035)!important}
      .card:hover{box-shadow:0 35px 90px rgba(0,0,0,.5),0 0 35px rgba(0,234,255,.1)!important}
      .bottle-body{box-shadow:inset 10px 0 17px rgba(255,255,255,.1),inset -15px 0 20px rgba(0,0,0,.78),0 25px 45px rgba(0,0,0,.6)!important}
      .footer{background:rgba(1,7,14,.8)}
      @keyframes mxBottle{0%,100%{transform:rotateY(-9deg) rotate(2deg) translateY(0)}50%{transform:rotateY(5deg) rotate(-1deg) translateY(-9px)}}
      @keyframes mxOrbit{to{transform:rotate(360deg)}}
      @media(max-width:950px){.hero{min-height:auto;padding-top:45px}.hero-visual{min-height:500px}.hero-visual:after{font-size:42px}.nav{min-height:68px}}
      @media(max-width:620px){.nav{min-height:62px}.logo{font-size:20px}.logo small{font-size:6px}.hero{padding-top:35px}.hero-visual{min-height:390px}.halo{width:330px!important;height:330px!important}.hero-bottle{width:165px!important;height:275px!important}.hero-label{top:62px!important;height:145px!important}.hero-label strong{font-size:30px!important}.hero-visual:after{font-size:34px;letter-spacing:4px}.float{font-size:8px;padding:8px 10px}.float.one{top:38px}.float.two{top:160px}.float.three{bottom:20px}.metrics{gap:18px}}
      @media(prefers-reduced-motion:reduce){.hero-bottle,.halo{animation:none!important}}
    `;
    document.head.appendChild(style);

    const logo = document.querySelector('.logo');
    if (logo) {
      logo.innerHTML = 'ECO<span>MAX</span><small>შპს ეკო-მაქსი • PROFESSIONAL AUTOMOTIVE CARE</small>';
      logo.setAttribute('aria-label','შპს ეკო-მაქსი ECOMAX');
    }

    const heroLabel = document.querySelector('.hero-label');
    if (heroLabel) {
      heroLabel.innerHTML = '<b>LVL</b><span>CHEMICAL • 3D SERIES</span><strong>5 L</strong>';
    }

    const eyebrow = document.querySelector('.eyebrow');
    if (eyebrow) eyebrow.innerHTML = '<i class="dot"></i> LVL-CHEMICAL • ECOMAX • PREMIUM CARE';

    const heroText = document.querySelector('.hero-copy > p');
    if (heroText) heroText.textContent = 'შპს ეკო-მაქსი — LVL-CHEMICAL-ის პროფესიონალური ავტოქიმია ავტომობილის მოვლისა და წმენდისთვის. ხარისხი, ეფექტურობა და პროფესიონალური შედეგი ერთ სისტემაში.';

    const metrics = document.querySelectorAll('.metric small');
    if (metrics.length >= 3) {
      metrics[0].textContent = 'პროფესიონალური პროდუქტი';
      metrics[1].textContent = 'მოცულობები';
      metrics[2].textContent = 'წელი გამოცდილება';
    }

    const title = document.querySelector('h1');
    if (title) title.innerHTML = 'სუფთა მანქანა.<br><span>პროფესიონალური</span><br>შედეგი.';

    const footer = document.querySelector('.footer');
    if (footer) footer.innerHTML = '© 2026 <strong>შპს ეკო-მაქსი</strong> — ECOMAX • LVL-CHEMICAL • ყველა უფლება დაცულია';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
