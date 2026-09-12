// ECOMAX — ONE shared Supabase Auth client for the entire site
// Public publishable key only. Never put a service_role key in frontend code.

const SUPABASE_URL = "https://mkxkqdvtmfbxmldnvsef.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd";

window.ECOMAX_SUPABASE = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY
};

(function createEcomaxSharedClient() {
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("ECOMAX: Supabase library did not load.");
    return;
  }

  if (window.ECOMAX_SUPABASE_CLIENT) return;

  const originalCreateClient = window.supabase.createClient.bind(window.supabase);

  const client = originalCreateClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey: "ecomax-auth",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  window.ECOMAX_SUPABASE_CLIENT = client;
  window.supabase.createClient = function () {
    return window.ECOMAX_SUPABASE_CLIENT;
  };

  window.ECOMAX_AUTH_READY = client.auth.getSession()
    .then(({ data }) => data?.session || null)
    .catch((error) => {
      console.warn("ECOMAX Auth session load:", error);
      return null;
    });
})();

/* Homepage-only premium responsive design. Functional pages are untouched. */
(function loadHomepageEnhancements() {
  const path = window.location.pathname.replace(/\\/+$/, "");
  const isHome = path === "" || path === "/index.html" || path.endsWith("/index.html");
  if (!isHome || document.getElementById("ecomaxEnhancementsCss")) return;

  const link = document.createElement("link");
  link.id = "ecomaxEnhancementsCss";
  link.rel = "stylesheet";
  link.href = "enhancements.css?v=20260913";
  document.head.appendChild(link);
})();

/* =========================================================
   ECOMAX FOOTER + MOVING CAR CREDIT
   Design-only layer. Does not touch auth/cart/checkout.
   ========================================================= */
(function installEcomaxBranding() {
  const COPYRIGHT = "© ყველა უფლება დაცულია შპს „ეკომაქსის“ მიერ";
  const DEVELOPER = "DEVELOPED BY BTCGAMER";

  function addStyle() {
    if (document.getElementById("ecomaxBrandingStyle")) return;

    const style = document.createElement("style");
    style.id = "ecomaxBrandingStyle";
    style.textContent = `
      .ecomax-footer-copyright {
        display: block !important;
        position: absolute !important;
        top: 10px !important;
        left: 18px !important;
        right: auto !important;
        bottom: auto !important;
        z-index: 100 !important;
        margin: 0 !important;
        color: #8da8b8 !important;
        font-size: 10px !important;
        line-height: 1.4 !important;
        font-weight: 700 !important;
        letter-spacing: .15px !important;
        text-align: left !important;
        white-space: nowrap !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .ecomax-car-developer {
        position: absolute !important;
        left: 50% !important;
        top: -24px !important;
        transform: translateX(-50%) !important;
        z-index: 20 !important;
        color: #00eaff !important;
        font-family: Arial, sans-serif !important;
        font-size: 7px !important;
        line-height: 1 !important;
        font-weight: 900 !important;
        letter-spacing: 1.1px !important;
        white-space: nowrap !important;
        text-shadow: 0 0 7px rgba(0,234,255,.85) !important;
        pointer-events: none !important;
      }

      .ecomax-road-car {
        overflow: visible !important;
      }

      @media (max-width: 600px) {
        .ecomax-footer-copyright {
          left: 12px !important;
          top: 8px !important;
          font-size: 9px !important;
          max-width: calc(100% - 24px) !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .ecomax-car-developer {
          top: -21px !important;
          font-size: 6px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function fixFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    addStyle();

    if (footer.querySelector(".ecomax-footer-copyright")) return;

    footer.querySelectorAll(".footer-bottom").forEach((el) => el.remove());
    footer.querySelectorAll(".ecomax-copyright").forEach((el) => el.remove());

    const main = footer.querySelector(".footer-main") || footer;
    if (getComputedStyle(main).position === "static") main.style.position = "relative";

    const copyright = document.createElement("span");
    copyright.className = "ecomax-footer-copyright";
    copyright.textContent = COPYRIGHT;
    main.appendChild(copyright);
  }

  function fixMovingCar() {
    const car = document.querySelector(".ecomax-road-car");
    if (!car || car.querySelector(".ecomax-car-developer")) return;

    const credit = document.createElement("span");
    credit.className = "ecomax-car-developer";
    credit.textContent = DEVELOPER;
    car.appendChild(credit);
  }

  function apply() {
    fixFooter();
    fixMovingCar();
  }

  function start() {
    apply();

    const observer = new MutationObserver(() => {
      fixMovingCar();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(fixMovingCar, 300);
    setTimeout(fixMovingCar, 1000);
    setTimeout(fixMovingCar, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();