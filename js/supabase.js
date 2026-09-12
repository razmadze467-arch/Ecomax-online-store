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
