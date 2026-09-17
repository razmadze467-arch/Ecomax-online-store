// ECOMAX — single Supabase Auth client
(function () {
  'use strict';
  const SUPABASE_URL = 'https://mkxkqdvtmfbxmldnvsef.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd';
  const STORAGE_KEY = 'ecomax-auth';
  window.ECOMAX_SUPABASE = { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
  function setSession(session) {
    window.ECOMAX_CURRENT_SESSION = session || null;
    window.ECOMAX_CURRENT_USER = session && session.user ? session.user : null;
  }
  function bootAuth() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      window.ECOMAX_SUPABASE_ERROR = 'Supabase JS SDK ვერ ჩაიტვირთა';
      return;
    }
    if (window.ECOMAX_SUPABASE_CLIENT) return;
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: { storageKey: STORAGE_KEY, storage: window.localStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
      });
      window.ECOMAX_SUPABASE_CLIENT = client;
      window.ECOMAX_AUTH_CLIENT = client;
      client.auth.getSession().then(function (result) {
        setSession(result && result.data ? result.data.session : null);
      }).catch(function () { setSession(null); });
      client.auth.onAuthStateChange(function (_event, session) { setSession(session); });
      window.ECOMAX_AUTH_READY = Promise.resolve(client);
    } catch (error) {
      window.ECOMAX_SUPABASE_ERROR = error && error.message ? error.message : String(error);
      console.error('ECOMAX Supabase error:', error);
    }
  }
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    bootAuth();
  } else {
    let tries = 0;
    const timer = setInterval(function () {
      tries++;
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        clearInterval(timer); bootAuth();
      } else if (tries >= 100) {
        clearInterval(timer); window.ECOMAX_SUPABASE_ERROR = 'Supabase JS SDK ვერ ჩაიტვირთა';
      }
    }, 50);
  }
  function css(id, href) {
    if (document.getElementById(id)) return;
    const link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; link.href = href; document.head.appendChild(link);
  }
  function js(id, src, onload) {
    if (document.getElementById(id)) return;
    const script = document.createElement('script'); script.id = id; script.src = src; script.defer = true; if (onload) script.onload = onload; document.head.appendChild(script);
  }
  css('ecomaxEnhancementsCss', 'enhancements-v2.css?v=20260913-7');
  css('ecomaxStoreUiCss', 'store-ui.css?v=20260913-7');
  css('ecomaxFinalUiCss', 'ecomax-final-ui.css?v=20260913-1');
  css('ecomaxHomeV3Css', 'home-v3.css?v=20260913-7');
  css('ecomaxResponsive5DCss', 'css/mobile-perfect-5d.css?v=20260916-2');
  css('ecomaxDeviceFinalCss', 'css/mobile-device-final.css?v=20260916-3');
  css('ecomaxFinalHomeFixCss', 'css/final-home-fix.css?v=20260916-2');
  css('ecomaxResponsiveFinalCss', 'css/responsive-final-5d.css?v=20260916-1');
  css('ecomaxAbsoluteFinalCss', 'css/absolute-responsive-final.css?v=20260916-1');
  css('ecomaxGeometryNuclearCss', 'css/geometry-nuclear-final.css?v=20260916-2');
  css('ecomaxViewportLayoutLockCss', 'css/viewport-layout-lock.css?v=20260916-3');
  css('ecomaxAbsoluteViewportFinalCss', 'css/absolute-viewport-final-20260916.css?v=20260916-1');
  css('ecomaxCartFinalLockCss', 'css/cart-final-lock.css?v=20260917-4');
  css('ecomaxNoFloatingCartCss', 'css/no-floating-cart.css?v=20260918-2');
  css('ecomaxPerformanceLiteCss', 'css/performance-lite.css?v=20260918-3');
  js('ecomaxStoreUiJs', 'store-ui.js?v=20260913-7');
  js('ecomaxFinalHomeJs', 'homepage-final.js?v=20260913-7', function () { if (typeof window.ECOMAX_FINAL_INIT === 'function') window.ECOMAX_FINAL_INIT(); });
  js('ecomaxFinalUiJs', 'ecomax-final-ui.js?v=20260913-1');
  js('ecomaxCartEmergencyFixJs', 'js/cart-emergency-fix.js?v=20260918-3');
  js('ecomaxFloatingCartKillJs', 'js/cart-floating-kill.js?v=20260918-1');
  js('ecomaxMobileHardFixJs', 'js/mobile-hardfix.js?v=20260916-2');
  js('ecomaxFinalHomeFixJs', 'js/final-home-fix.js?v=20260916-2');
  js('ecomaxModalHardFixJs', 'js/modal-hardfix.js?v=20260917-1');
})();
