/* ECOMAX — single, isolated Supabase Auth client for auth pages */
(function () {
  'use strict';

  const URL = 'https://mkxkqdvtmfbxmldnvsef.supabase.co';
  const KEY = 'sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd';
  const STORAGE = 'ecomax-auth';

  function create() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('Supabase JS ვერ ჩაიტვირთა. განაახლე გვერდი.');
    }
    if (window.ECOMAX_AUTH_CLIENT && window.ECOMAX_AUTH_CLIENT.auth) {
      return window.ECOMAX_AUTH_CLIENT;
    }
    const client = window.supabase.createClient(URL, KEY, {
      auth: {
        storageKey: STORAGE,
        storage: window.localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
    window.ECOMAX_AUTH_CLIENT = client;
    window.ECOMAX_SUPABASE_CLIENT = client;
    return client;
  }

  window.ECOMAX_AUTH_READY = create();
})();
