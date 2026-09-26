// ECOMAX — single Supabase client
(function () {
  'use strict';

  const SUPABASE_URL = 'https://mkxkqdvtmfbxmldnvsef.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd';
  const STORAGE_KEY = 'ecomax-auth';
  const BRIDGE_KEY = 'ecomax-auth-bridge-v1';
  const BACKUP_KEY = 'ecomax-auth-backup-v1';
  const BACKUP_ENABLED = false;

  window.ECOMAX_SUPABASE = { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
  window.ECOMAX_GET_SESSION = getSessionSafe;

  function tokenPair(session) {
    if (!session?.access_token || !session?.refresh_token) return null;
    return { access_token: session.access_token, refresh_token: session.refresh_token };
  }

  function saveSessionBackup(session) {
    const pair = tokenPair(session);
    if (!pair || !BACKUP_ENABLED) return false;
    let ok = false;
    try { sessionStorage.setItem(BRIDGE_KEY, JSON.stringify(pair)); ok = true; } catch (_) {}
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(pair)); ok = true; } catch (_) {}
    return ok;
  }

  window.ECOMAX_SAVE_SESSION_BACKUP = saveSessionBackup;

  async function restoreBackup(client) {
    if (!BACKUP_ENABLED) return null;
    const keys = [BRIDGE_KEY, BACKUP_KEY];
    for (const key of keys) {
      try {
        const store = key === BRIDGE_KEY ? sessionStorage : localStorage;
        const raw = store.getItem(key);
        if (!raw) continue;
        const pair = JSON.parse(raw);
        if (!pair?.access_token || !pair?.refresh_token) continue;
        const restored = await client.auth.setSession(pair);
        if (restored?.data?.session) {
          saveSessionBackup(restored.data.session);
          return restored.data.session;
        }
      } catch (_) {}
    }
    return null;
  }

  async function getSessionSafe(client) {
    if (!client?.auth) return null;

    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const result = await client.auth.getSession();
        if (result?.data?.session) {
          saveSessionBackup(result.data.session);
          return result.data.session;
        }
      } catch (error) {
        if (attempt === 3) console.warn('ECOMAX getSession:', error);
      }
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
    }

    const restored = await restoreBackup(client);
    if (restored) return restored;

    try {
      const refreshed = await client.auth.refreshSession();
      if (refreshed?.data?.session) {
        saveSessionBackup(refreshed.data.session);
        return refreshed.data.session;
      }
    } catch (_) {}

    return null;
  }

  window.ECOMAX_PRESERVE_SESSION = async function(client) {
    if (!client?.auth) return null;
    try {
      const session = await getSessionSafe(client);
      if (session?.access_token && session?.refresh_token) {
        saveSessionBackup(session);
        const persisted = await client.auth.setSession(tokenPair(session));
        if (persisted?.data?.session) saveSessionBackup(persisted.data.session);
        return persisted?.data?.session || session;
      }
    } catch (error) {
      console.warn('ECOMAX preserve session:', error);
    }
    return null;
  };

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
          if (data?.session) saveSessionBackup(data.session);
        })
        .catch(() => {});

      client.auth.onAuthStateChange((_event, session) => {
        if (session) saveSessionBackup(session);
        else {
          try { sessionStorage.removeItem(BRIDGE_KEY); } catch (_) {}
          try { localStorage.removeItem(BACKUP_KEY); } catch (_) {}
        }
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