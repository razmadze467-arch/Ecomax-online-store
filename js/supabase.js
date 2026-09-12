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
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  // Remove the old developer credit if it exists.
  footer.querySelectorAll("strong").forEach((el) => {
    if (/DEVELOPED\s+BY\s+BTCGAMER/i.test(el.textContent || "")) {
      el.remove();
    }
  });

  // Replace the old copyright line.
  footer.querySelectorAll("span").forEach((el) => {
    if (/ECOMAX|ყველა უფლება დაცულია/i.test(el.textContent || "")) {
      el.textContent = "© საავტორო უფლება დაცულია შპს „ეკომაქსის“ მიერ";
    }
  });

  // Add a dedicated bottom-left copyright label so it is always visible.
  let copyright = footer.querySelector(".ecomax-copyright");
  if (!copyright) {
    copyright = document.createElement("div");
    copyright.className = "ecomax-copyright";
    copyright.textContent = "© საავტორო უფლება დაცულია შპს „ეკომაქსის“ მიერ";
    footer.appendChild(copyright);
  }

  Object.assign(footer.style, {
    position: "relative",
    overflow: "hidden"
  });

  Object.assign(copyright.style, {
    position: "absolute",
    left: "18px",
    bottom: "10px",
    zIndex: "20",
    maxWidth: "70%",
    color: "rgba(141,168,184,.78)",
    fontSize: "9px",
    lineHeight: "1.35",
    letterSpacing: ".2px",
    textAlign: "left",
    pointerEvents: "none",
    textShadow: "0 0 10px rgba(0,234,255,.08)"
  });

  const media = document.createElement("style");
  media.textContent = `
    @media (max-width: 600px) {
      .ecomax-copyright {
        left: 12px !important;
        bottom: 8px !important;
        max-width: 78% !important;
        font-size: 8px !important;
      }
    }
  `;
  document.head.appendChild(media);
});
