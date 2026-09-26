// ECOMAX — single Supabase client
(function () {
  'use strict';

  const SUPABASE_URL = 'https://mkxkqdvtmfbxmldnvsef.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd';
  const STORAGE_KEY = 'ecomax-auth';

  window.ECOMAX_SUPABASE = { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
  window.ECOMAX_GET_SESSION = getSessionSafe;

  async function getSessionSafe(client) {
    if (!client?.auth) return null;

    try {
      const first = await client.auth.getSession();
      if (first?.data?.session) return first.data.session;
    } catch (error) {
      console.warn('ECOMAX getSession:', error);
    }

    // Recover a persisted session if the access token has just expired.
    try {
      const refreshed = await client.auth.refreshSession();
      return refreshed?.data?.session || null;
    } catch (error) {
      return null;
    }
  }

  function boot() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      window.ECOMAX_SUPABASE_ERROR = 'Supabase JS SDK ვერ ჩაიტვირთა';
      return;
    }

    if (window.ECOMAX_SUPABASE_CLIENT) {
      window.ECOMAX_AUTH_CLIENT = window.ECOMAX_SUPABASE_CLIENT;
      window.ECOMAX_AUTH_READY = Promise.resolve(window.ECOMAX_SUPABASE_CLIENT);
      loadOrderUX();
      return;
    }

    try {
      const client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            storageKey: STORAGE_KEY,
            storage: window.localStorage,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          }
        }
      );

      window.ECOMAX_SUPABASE_CLIENT = client;
      window.ECOMAX_AUTH_CLIENT = client;
      window.ECOMAX_AUTH_READY = Promise.resolve(client);

      client.auth.getSession()
        .then(({ data }) => {
          window.ECOMAX_CURRENT_SESSION = data?.session || null;
          window.ECOMAX_CURRENT_USER = data?.session?.user || null;
        })
        .catch(() => {});

      client.auth.onAuthStateChange((_event, session) => {
        window.ECOMAX_CURRENT_SESSION = session || null;
        window.ECOMAX_CURRENT_USER = session?.user || null;
      });

      loadOrderUX();
    } catch (error) {
      window.ECOMAX_SUPABASE_ERROR = error?.message || String(error);
      console.error('ECOMAX Supabase error:', error);
    }
  }

  function loadOrderUX() {
    if (!/(^|\/)(account|admin)\.html$/i.test(location.pathname)) return;
    if (document.querySelector('script[data-ecomax-order-ux]')) return;
    const s = document.createElement('script');
    s.src = 'js/order-tracking-ux.js?v=20260920-1';
    s.async = false;
    s.dataset.ecomaxOrderUx = '1';
    (document.head || document.documentElement).appendChild(s);
  }

  boot();
})();