// ECOMAX — ONE shared Supabase Auth client
const SUPABASE_URL = "https://mkxkqdvtmfbxmldnvsef.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd";
window.ECOMAX_SUPABASE = { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };
(function(){
  if(!window.supabase || typeof window.supabase.createClient !== 'function') return;
  if(window.ECOMAX_SUPABASE_CLIENT) return;
  const original=window.supabase.createClient.bind(window.supabase);
  window.ECOMAX_SUPABASE_CLIENT=original(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{storageKey:'ecomax-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  window.supabase.createClient=function(){return window.ECOMAX_SUPABASE_CLIENT;};
  window.ECOMAX_AUTH_READY=window.ECOMAX_SUPABASE_CLIENT.auth.getSession().then(function(r){return r.data?.session||null;}).catch(function(){return null;});
})();
(function(){
  const path=window.location.pathname.replace(/\\/+$/,'');
  const home=path===''||path==='/index.html'||path.endsWith('/index.html');
  if(!home)return;
  function css(id,href){if(document.getElementById(id))return;const x=document.createElement('link');x.id=id;x.rel='stylesheet';x.href=href;document.head.appendChild(x);}
  function js(id,src,rerun){if(document.getElementById(id))return;const x=document.createElement('script');x.id=id;x.src=src;x.defer=true;if(rerun)x.onload=function(){document.dispatchEvent(new Event('DOMContentLoaded'));};document.head.appendChild(x);}
  css('ecomaxEnhancementsCss','enhancements-v2.css?v=20260913-5');
  css('ecomaxStoreUiCss','store-ui.css?v=20260913-5');
  js('ecomaxStoreUiJs','store-ui.js?v=20260913-5');
  js('ecomaxFinalHomeJs','homepage-final.js?v=20260913-5',true);
})();