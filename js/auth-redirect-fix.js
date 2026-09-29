/* ECOMAX auth redirect fix */
(function(){
  var ready=window.ECOMAX_AUTH_BOOTSTRAP_READY;
  if(!ready)return;
  ready.then(function(session){
    if(!session)return;
    if(/\/login\.html$/.test(location.pathname)){
      var p=new URLSearchParams(location.search),r=p.get('redirect');
      var role=String(session&&session.user&&session.user.app_metadata&&session.user.app_metadata.role||'').toLowerCase();
      var target=role==='courier'?'line.html':((r&&/^[A-Za-z0-9_\-\/]+\.html$/.test(r))?r:'account.html');
      setTimeout(function(){location.replace(target);},100);
    }
  });
})();
