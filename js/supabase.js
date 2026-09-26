// ECOMAX — single shared Supabase auth client
(function () {
  'use strict';

  const SUPABASE_URL = 'https://mkxkqdvtmfbxmldnvsef.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd';
  const STORAGE_KEY = 'ecomax-auth';
  const BRIDGE_KEY = 'ecomax-auth-bridge-v1';

  window.ECOMAX_SUPABASE = { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };

  function saveBridge(session) {
    try {
      if (!session?.access_token || !session?.refresh_token) return;
      sessionStorage.setItem(BRIDGE_KEY, JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      }));
    } catch (_) {}
  }

  function readBridge() {
    try {
      const raw = sessionStorage.getItem(BRIDGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data?.access_token && data?.refresh_token ? data : null;
    } catch (_) {
      return null;
    }
  }

  async function restoreBridge(client) {
    const data = readBridge();
    if (!data) return null;
    try {
      const result = await client.auth.setSession(data);
      const session = result?.data?.session || null;
      if (session) {
        saveBridge(session);
        return session;
      }
    } catch (_) {}
    return null;
  }

  async function getSessionSafe(client) {
    if (!client?.auth) return null;

    try {
      const result = await client.auth.getSession();
      if (result?.data?.session) {
        saveBridge(result.data.session);
        return result.data.session;
      }
    } catch (_) {}

    const bridged = await restoreBridge(client);
    if (bridged) return bridged;

    try {
      const result = await client.auth.refreshSession();
      if (result?.data?.session) {
        saveBridge(result.data.session);
        return result.data.session;
      }
    } catch (_) {}

    return null;
  }

  window.ECOMAX_GET_SESSION = getSessionSafe;

  window.ECOMAX_PRESERVE_SESSION = async function (client) {
    const session = await getSessionSafe(client);
    if (!session) return null;
    saveBridge(session);
    return session;
  };

  function boot() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      window.ECOMAX_SUPABASE_ERROR = 'Supabase JS SDK ვერ ჩაიტვირთა';
      window.ECOMAX_AUTH_READY = Promise.reject(new Error(window.ECOMAX_SUPABASE_ERROR));
      return;
    }

    if (window.ECOMAX_SUPABASE_CLIENT?.auth) {
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

      client.auth.getSession().then(({ data }) => {
        const session = data?.session || null;
        window.ECOMAX_CURRENT_SESSION = session;
        window.ECOMAX_CURRENT_USER = session?.user || null;
        if (session) saveBridge(session);
      }).catch(() => {});

      client.auth.onAuthStateChange((event, session) => {
        if (session) {
          saveBridge(session);
          window.ECOMAX_CURRENT_SESSION = session;
          window.ECOMAX_CURRENT_USER = session.user || null;
        } else if (event === 'SIGNED_OUT') {
          try { sessionStorage.removeItem(BRIDGE_KEY); } catch (_) {}
          window.ECOMAX_CURRENT_SESSION = null;
          window.ECOMAX_CURRENT_USER = null;
        }
      });

      loadOrderUX();
    } catch (error) {
      window.ECOMAX_SUPABASE_ERROR = error?.message || String(error);
      window.ECOMAX_AUTH_READY = Promise.reject(error);
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