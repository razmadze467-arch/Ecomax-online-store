/* ECOMAX — single auth bootstrap
   IMPORTANT: this file must never redirect normal users.
   Login/register/checkout pages own their navigation. */
(function(){
  'use strict';
  if(window.__ECOMAX_AUTH_FIX__) return;
  window.__ECOMAX_AUTH_FIX__=true;

  function loadScript(id,src){
    if(document.getElementById(id)) return;
    var s=document.createElement('script');
    s.id=id;
    s.src=src;
    s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  function start(){
    /* Session bootstrap only. No automatic login/account redirect. */
    loadScript('ecomaxAuthBootstrap','js/auth-bootstrap.js?v=20260915-3');

    /* Admin protection is the only page-level guard allowed here. */
    var path=(location.pathname||'').toLowerCase();
    if(path.endsWith('/admin.html') || path==='admin.html'){
      loadScript('ecomaxAdminAccessGuard','js/admin-access-guard.js?v=20260915-2');
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
