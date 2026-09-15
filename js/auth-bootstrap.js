/* ECOMAX — reliable auth bootstrap */
(function(){
  'use strict';
  if(window.ECOMAX_AUTH_BOOTSTRAP_READY) return;

  var SHARED='ecomax-auth';
  var LEGACY='sb-mkxkqdvtmfbxmldnvsef-auth-token';
  var MAX_WAIT=8000;

  function syncStorage(){
    try{
      var a=localStorage.getItem(SHARED);
      var b=localStorage.getItem(LEGACY);
      if(!a && b) localStorage.setItem(SHARED,b);
      if(a && !b) localStorage.setItem(LEGACY,a);
    }catch(e){}
  }

  function publish(session){
    window.ECOMAX_CURRENT_SESSION=session||null;
    window.ECOMAX_CURRENT_USER=session&&session.user||null;
    syncStorage();
    return session||null;
  }

  syncStorage();

  window.ECOMAX_AUTH_BOOTSTRAP_READY=new Promise(function(resolve){
    var started=Date.now();

    function check(){
      var client=window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT;

      if(client && client.auth){
        window.ECOMAX_AUTH_CLIENT=client;

        client.auth.getSession().then(function(r){
          var session=r&&r.data&&r.data.session;
          if(session){
            resolve(publish(session));
            return;
          }

          /* Do not declare the user logged out during Supabase startup. */
          if(Date.now()-started < MAX_WAIT){
            setTimeout(check,250);
            return;
          }

          resolve(publish(null));
        }).catch(function(){
          if(Date.now()-started < MAX_WAIT){
            setTimeout(check,250);
          }else{
            resolve(publish(null));
          }
        });
        return;
      }

      if(Date.now()-started >= MAX_WAIT){
        resolve(publish(null));
        return;
      }
      setTimeout(check,100);
    }

    check();
  });
})();
