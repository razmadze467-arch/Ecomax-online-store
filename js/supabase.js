// ECOMAX — ONE shared Supabase Auth client
const SUPABASE_URL = "https://mkxkqdvtmfbxmldnvsef.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd";
const ECOMAX_AUTH_STORAGE = "ecomax-auth";
const ECOMAX_LEGACY_STORAGE = "sb-mkxkqdvtmfbxmldnvsef-auth-token";
window.ECOMAX_SUPABASE = {url:SUPABASE_URL,key:SUPABASE_ANON_KEY};
(function(){
  try{
    const shared=localStorage.getItem(ECOMAX_AUTH_STORAGE);
    const legacy=localStorage.getItem(ECOMAX_LEGACY_STORAGE);
    if(!shared&&legacy)localStorage.setItem(ECOMAX_AUTH_STORAGE,legacy);
  }catch(e){}
  if(!window.supabase||typeof window.supabase.createClient!=="function"){
    console.error("ECOMAX: Supabase CDN is not loaded.");
    return;
  }
  if(window.ECOMAX_SUPABASE_CLIENT)return;
  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{storageKey:ECOMAX_AUTH_STORAGE,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
  window.ECOMAX_SUPABASE_CLIENT=client;
  window.ECOMAX_AUTH_CLIENT=client;
  window.supabase.createClient=function(){return window.ECOMAX_SUPABASE_CLIENT;};
  window.ECOMAX_AUTH_READY=client.auth.getSession().then(function(r){return r&&r.data?r.data.session:null;}).catch(function(){return null;});
})();
(function(){
  function load(){
    if(document.getElementById("ecomaxAuthFixJs"))return;
    const s=document.createElement("script");s.id="ecomaxAuthFixJs";s.src="js/auth-fix.js?v=20260914-3";s.defer=true;document.head.appendChild(s);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load);else load();
})();
(function(){
  const path=window.location.pathname.replace(/\\/+$/,'');
  const home=path===''||path==='/index.html'||path.endsWith('/index.html');
  if(!home)return;
  function css(id,href){if(document.getElementById(id))return;const x=document.createElement('link');x.id=id;x.rel='stylesheet';x.href=href;document.head.appendChild(x);}
  function js(id,src,cb){if(document.getElementById(id))return;const x=document.createElement('script');x.id=id;x.src=src;x.defer=true;if(cb)x.onload=cb;document.head.appendChild(x);}
  css('ecomaxEnhancementsCss','enhancements-v2.css?v=20260913-7');
  css('ecomaxStoreUiCss','store-ui.css?v=20260913-7');
  css('ecomaxFinalUiCss','ecomax-final-ui.css?v=20260913-1');
  js('ecomaxStoreUiJs','store-ui.js?v=20260913-7');
  js('ecomaxFinalHomeJs','homepage-final.js?v=20260913-7',function(){if(window.ECOMAX_FINAL_INIT)window.ECOMAX_FINAL_INIT();});
  js('ecomaxFinalUiJs','ecomax-final-ui.js?v=20260913-1');
})();
