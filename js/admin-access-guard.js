/* ECOMAX — single administrator access guard */
(function(){
  if(window.__ECOMAX_ADMIN_ACCESS_GUARD__) return;
  window.__ECOMAX_ADMIN_ACCESS_GUARD__=true;

  var ADMIN_EMAIL='datogringo@gmail.com';
  var path=(location.pathname||'').toLowerCase();
  var isAdminPage=path.endsWith('/admin.html') || path==='admin.html';
  var checked=false;

  function hideAdminLinks(){
    document.querySelectorAll('a[href*="admin.html"],a[href*="/admin.html"]').forEach(function(a){
      a.style.display='none';
      a.setAttribute('aria-hidden','true');
    });
  }

  function blockAdminPage(){
    if(!isAdminPage || checked) return;
    checked=true;
    document.documentElement.setAttribute('data-ecomax-admin-blocked','true');
    var app=document.getElementById('adminApp');
    var login=document.getElementById('loginScreen');
    if(app) app.classList.add('hidden');
    if(login) login.classList.add('hidden');
    location.replace('/');
  }

  function allowAdminPage(){
    checked=true;
    document.documentElement.removeAttribute('data-ecomax-admin-blocked');
  }

  async function run(){
    var client=window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT;
    if(!client||!client.auth){
      if(isAdminPage) return setTimeout(run,100);
      hideAdminLinks();
      return;
    }

    try{
      if(window.ECOMAX_AUTH_READY) await window.ECOMAX_AUTH_READY;
      var result=await client.auth.getSession();
      var session=result&&result.data&&result.data.session;
      var email=session&&session.user&&session.user.email;
      var allowed=!!email && String(email).trim().toLowerCase()===ADMIN_EMAIL;

      if(isAdminPage){
        if(allowed) allowAdminPage();
        else blockAdminPage();
      }else if(!allowed){
        hideAdminLinks();
      }
    }catch(e){
      if(isAdminPage) blockAdminPage();
      else hideAdminLinks();
    }
  }

  var style=document.createElement('style');
  style.textContent='html[data-ecomax-admin-blocked="true"] #adminApp,html[data-ecomax-admin-blocked="true"] #loginScreen{display:none!important;}';
  (document.head||document.documentElement).appendChild(style);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',run,{once:true});
  }else{
    run();
  }

  if(isAdminPage){
    setInterval(function(){
      if(!checked) run();
    },500);
  }
})();
