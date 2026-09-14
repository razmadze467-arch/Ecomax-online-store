/* ECOMAX — single administrator access guard */
(function(){
  if(window.__ECOMAX_ADMIN_ACCESS_GUARD__) return;
  window.__ECOMAX_ADMIN_ACCESS_GUARD__=true;

  var ADMIN_EMAIL='datogringo@gmail.com';
  var path=(location.pathname||'').toLowerCase();
  var isAdminPage=path.endsWith('/admin.html') || path==='admin.html';

  function hideAdminLinks(){
    document.querySelectorAll('a[href*="admin.html"],a[href*="/admin.html"]').forEach(function(a){
      a.style.display='none';
      a.setAttribute('aria-hidden','true');
    });
  }

  function showAdminPage(){
    document.documentElement.removeAttribute('data-ecomax-admin-blocked');
    document.querySelectorAll('.app').forEach(function(el){el.style.display='flex';});
  }

  function blockAdminPage(){
    document.documentElement.setAttribute('data-ecomax-admin-blocked','true');
    location.replace('index.html');
  }

  function run(){
    var client=window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT;
    if(!client||!client.auth){
      if(isAdminPage) setTimeout(run,100);
      else hideAdminLinks();
      return;
    }
    client.auth.getSession().then(function(result){
      var session=result&&result.data&&result.data.session;
      var email=session&&session.user&&session.user.email;
      var allowed=!!email && String(email).toLowerCase()===ADMIN_EMAIL;

      if(isAdminPage){
        if(allowed) showAdminPage();
        else blockAdminPage();
      }else if(!allowed){
        hideAdminLinks();
      }
    }).catch(function(){
      if(isAdminPage) blockAdminPage();
      else hideAdminLinks();
    });
  }

  if(isAdminPage){
    var style=document.createElement('style');
    style.textContent='html[data-ecomax-admin-blocked="true"] .app{display:none!important;}';
    document.head.appendChild(style);
    document.addEventListener('DOMContentLoaded',run,{once:true});
  }else{
    document.addEventListener('DOMContentLoaded',run,{once:true});
  }
})();
