/* ECOMAX — Login/Register mobile + auth stability pass */
(function(){
  'use strict';
  if(window.__ECOMAX_AUTH_MOBILE__) return;
  window.__ECOMAX_AUTH_MOBILE__=true;

  const css=document.createElement('style');
  css.id='ecomaxAuthMobileCss';
  css.textContent=`
    html,body{width:100%;max-width:100%;overflow-x:hidden;-webkit-text-size-adjust:100%}
    button,a,input{touch-action:manipulation}
    input,button{font-size:16px}
    @media(max-width:900px){
      body{min-height:100dvh}
      header{padding:0 12px}
      .nav{width:100%!important;max-width:680px;margin:auto}
      main{width:calc(100% - 24px)!important;box-sizing:border-box}
      .login-card,.register-card{box-sizing:border-box;width:100%!important}
      .login-button,.register-button{min-height:50px}
    }
    @media(max-width:560px){
      .topbar{padding:8px 10px;line-height:1.35;text-align:center}
      .nav{height:58px!important}
      .logo{font-size:18px!important;letter-spacing:3px!important}
      .back{min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:8px 10px!important}
      main{padding:28px 0 42px!important;gap:28px!important}
      .intro h1{font-size:38px!important;line-height:1.02}
      .intro p{font-size:11px;line-height:1.65}
      .features{width:100%!important}
      .feature{min-height:42px}
      .login-card,.register-card{padding:20px 15px!important;border-radius:16px!important}
      .card-header{margin-bottom:20px!important}
      .card-header h2{font-size:24px!important}
      .field{margin-bottom:14px!important}
      input{height:52px!important;border-radius:12px!important}
      .password-toggle{width:42px!important;height:42px!important;right:5px!important}
      .options{gap:12px;align-items:flex-start}
      .remember{min-height:42px}
      .forgot{display:inline-flex;align-items:center;min-height:42px}
      .login-button,.register-button{height:52px!important;border-radius:12px!important}
      .register a,.login-link a{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:0 8px}
      footer{padding:18px 12px!important}
    }
    @media(max-width:380px){
      main{width:calc(100% - 16px)!important}
      .intro h1{font-size:34px!important}
      .login-card,.register-card{padding:18px 12px!important}
      .options{flex-direction:column}
      .forgot{align-self:flex-end}
    }
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}
  `;
  (document.head||document.documentElement).appendChild(css);

  // Always prefer the site's singleton client. This prevents page-local clients
  // from creating a second storage/session configuration.
  function getClient(){
    return window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT||null;
  }

  function patchPageClient(){
    const c=getClient();
    if(c) window.ECOMAX_AUTH_CLIENT=c;
    return c;
  }

  // Keep the page's local `supabaseClient` reference aligned with the singleton
  // when the page has already declared it.
  try{
    Object.defineProperty(window,'ECOMAX_GET_AUTH_CLIENT',{value:getClient,writable:false,configurable:true});
  }catch(e){ window.ECOMAX_GET_AUTH_CLIENT=getClient; }

  patchPageClient();

  // Guard against accidental duplicate form submissions on slow mobile networks.
  document.addEventListener('submit',function(e){
    const form=e.target;
    if(!form || !(/loginForm|registerForm/.test(form.id||''))) return;
    if(form.dataset.ecomaxSubmitting==='1'){
      e.preventDefault();
      return;
    }
    form.dataset.ecomaxSubmitting='1';
    setTimeout(function(){form.dataset.ecomaxSubmitting='0';},1500);
  },true);

  // If auth bootstrap detects an existing session, make sure login/register
  // pages never remain visible because of a stale page-level session check.
  function redirectExisting(){
    const path=(location.pathname||'').toLowerCase();
    if(!(/\/login\.html$|\/register\.html$/.test(path))) return;
    const ready=window.ECOMAX_AUTH_READY||window.ECOMAX_AUTH_BOOTSTRAP_READY;
    if(!ready||typeof ready.then!=='function') return;
    ready.then(function(session){
      if(!session) return;
      const params=new URLSearchParams(location.search);
      const r=params.get('redirect');
      const target=(r&&/^[A-Za-z0-9_\-\/]+\.html(?:\?[A-Za-z0-9_=&\-]*)?$/.test(r))?r:'account.html';
      if(location.pathname.toLowerCase().endsWith('/login.html')||location.pathname.toLowerCase().endsWith('/register.html')){
        location.replace(target);
      }
    }).catch(function(){});
  }
  setTimeout(redirectExisting,0);
})();
