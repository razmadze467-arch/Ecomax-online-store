/* ECOMAX auth check — never logs tokens */
(function(){
  if(window.__ECOMAX_AUTH_CHECK__) return;
  window.__ECOMAX_AUTH_CHECK__=true;
  function check(label){
    var c=window.ECOMAX_SUPABASE_CLIENT;
    if(!c||!c.auth){ console.warn('[ECOMAX AUTH]',label,'client missing'); return; }
    c.auth.getSession().then(function(r){
      var s=r&&r.data&&r.data.session;
      console.log('[ECOMAX AUTH]',label,{session:!!s,user:!!(s&&s.user),origin:location.origin,path:location.pathname,shared:!!localStorage.getItem('ecomax-auth'),legacy:!!localStorage.getItem('sb-mkxkqdvtmfbxmldnvsef-auth-token')});
    }).catch(function(e){ console.warn('[ECOMAX AUTH]',label,'getSession failed',e&&e.message||String(e)); });
  }
  var c=window.ECOMAX_SUPABASE_CLIENT;
  if(c&&c.auth){
    c.auth.onAuthStateChange(function(event,session){
      console.log('[ECOMAX AUTH EVENT]',event,{session:!!session,user:!!(session&&session.user),origin:location.origin,path:location.pathname});
    });
    check('startup');
    setTimeout(function(){check('after-1s');},1000);
    setTimeout(function(){check('after-3s');},3000);
  }else{
    setTimeout(function(){check('delayed');},1000);
  }
})();
