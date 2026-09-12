// ECOMAX — ONE shared Supabase Auth client for the entire site
// Public publishable key only. Never put a service_role key in frontend code.

const SUPABASE_URL = "https://mkxkqdvtmfbxmldnvsef.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd";

window.ECOMAX_SUPABASE = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY
};

/*
  IMPORTANT:
  Every ECOMAX page must use the same Auth storage key and the same
  browser client. This prevents the login page, account page and
  homepage from getting out of sync when the user returns to Home.
*/

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

  // Compatibility with existing ECOMAX pages which still call
  // window.supabase.createClient(...). They will all receive this
  // single shared client instead of creating competing Auth clients.
  window.supabase.createClient = function () {
    return window.ECOMAX_SUPABASE_CLIENT;
  };

  // Helpful promise for pages that need to wait until Auth has loaded.
  window.ECOMAX_AUTH_READY = client.auth.getSession()
    .then(({ data }) => data?.session || null)
    .catch((error) => {
      console.warn("ECOMAX Auth session load:", error);
      return null;
    });
})();

/* =========================================================
   ECOMAX FOOTER COPYRIGHT
   Design-only footer correction. Does not touch auth/cart/checkout.
   ========================================================= */
(function installEcomaxFooterCopyright() {
  function applyFooterCopyright() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const oldBottom = footer.querySelector(".footer-bottom");
    const copyrightText = "© საავტორო უფლება დაცულია შპს „ეკომაქსის“ მიერ";

    // Remove the old developer credit wherever it appears in the footer.
    footer.querySelectorAll("strong, span").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (/DEVELOPED\s+BY\s+BTCGAMER/i.test(text) || /2026\s+ECOMAX/i.test(text) || /ყველა უფლება დაცულია/i.test(text)) {
        el.remove();
      }
    });

    // Put the requested text into the existing footer-bottom container.
    const target = oldBottom || footer.appendChild(document.createElement("div"));
    target.className = "footer-bottom ecomax-footer-bottom";
    target.innerHTML = "";

    const copyright = document.createElement("span");
    copyright.className = "ecomax-copyright";
    copyright.textContent = copyrightText;
    target.appendChild(copyright);

    Object.assign(target.style, {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      minHeight: "32px",
      padding: "8px 18px",
      boxSizing: "border-box",
      textAlign: "left",
      zIndex: "50"
    });

    Object.assign(copyright.style, {
      display: "block",
      position: "relative",
      left: "auto",
      right: "auto",
      bottom: "auto",
      zIndex: "51",
      color: "#8da8b8",
      fontSize: "10px",
      lineHeight: "1.4",
      fontWeight: "600",
      letterSpacing: ".15px",
      textAlign: "left",
      whiteSpace: "normal",
      visibility: "visible",
      opacity: "1"
    });

    // Mobile: keep it clearly visible in the bottom-left without overflow.
    if (!document.querySelector("#ecomaxFooterCopyrightStyle")) {
      const style = document.createElement("style");
      style.id = "ecomaxFooterCopyrightStyle";
      style.textContent = `
        .ecomax-footer-bottom .ecomax-copyright {
          visibility: visible !important;
          opacity: 1 !important;
        }
        @media (max-width: 600px) {
          .ecomax-footer-bottom {
            justify-content: flex-start !important;
            padding: 8px 12px !important;
          }
          .ecomax-footer-bottom .ecomax-copyright {
            font-size: 9px !important;
            max-width: 95% !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFooterCopyright, { once: true });
  } else {
    applyFooterCopyright();
  }
})();