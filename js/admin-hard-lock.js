// ECOMAX — hard Admin Panel lock
(function(){
  if(window.__ECOMAX_ADMIN_HARD_LOCK__) return;
  window.__ECOMAX_ADMIN_HARD_LOCK__=true;

  const ADMIN_EMAIL='datogringo@gmail.com';
  const path=(location.pathname||'').toLowerCase();
  const isAdminPage=path.endsWith('/admin.html') || path==='admin.html';
  if(!isAdminPage) return;

  window.ECOMAX_ADMIN_ALLOWED=false;

  // Keep the admin application hidden until the exact administrator is verified.
  const style=document.createElement('style');
  style.id='ecomaxAdminHardLockCss';
  style.textContent='#adminApp{display:none!important}#loginScreen{display:grid!important}';
  (document.head||document.documentElement).appendChild(style);

  function isAllowed(user){
    return !!(user&&user.email&&String(user.email).trim().toLowerCase()===ADMIN_EMAIL);
  }

  function showAdmin(){
    window.ECOMAX_ADMIN_ALLOWED=true;
    const s=document.getElementById('loginScreen');
    const a=document.getElementById('adminApp');
    if(s) s.classList.add('hidden');
    if(a) a.classList.remove('hidden');
    style.textContent='#loginScreen{display:none!important}#adminApp{display:flex!important}';
    if(typeof window.refreshAll==='function') window.refreshAll();
  }

  function deny(){
    window.ECOMAX_ADMIN_ALLOWED=false;
    try{
      const client=window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT;
      if(client&&client.auth) client.auth.signOut().catch(function(){});
    }catch(e){}
    style.textContent='#adminApp{display:none!important}#loginScreen{display:none!important}';
    setTimeout(function(){ location.replace('/'); },30);
  }

  async function check(){
    const client=window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT;
    if(!client||!client.auth){ return setTimeout(check,50); }
    try{
      if(window.ECOMAX_AUTH_READY) await window.ECOMAX_AUTH_READY;
      const r=await client.auth.getSession();
      const session=r&&r.data&&r.data.session;
      if(session&&isAllowed(session.user)) showAdmin();
      else if(session) deny();
      else {
        window.ECOMAX_ADMIN_ALLOWED=false;
        style.textContent='#adminApp{display:none!important}#loginScreen{display:grid!important}';
      }

      client.auth.onAuthStateChange(function(event,session){
        if(session&&isAllowed(session.user)) showAdmin();
        else if(session) deny();
        else if(event==='SIGNED_OUT'){
          window.ECOMAX_ADMIN_ALLOWED=false;
          style.textContent='#adminApp{display:none!important}#loginScreen{display:grid!important}';
        }
      });
    }catch(e){ deny(); }
  }

  check();
})();
