/* ECOMAX auth bootstrap: waits for the shared client before page auth code runs. */
(function(){
  if(window.ECOMAX_AUTH_BOOTSTRAP_READY)return;
  window.ECOMAX_AUTH_BOOTSTRAP_READY=new Promise(function(resolve){
    var tries=0;
    function check(){
      var client=window.ECOMAX_SUPABASE_CLIENT;
      if(client&&client.auth){
        window.ECOMAX_AUTH_CLIENT=client;
        client.auth.getSession().then(function(r){
          var s=r&&r.data?r.data.session:null;
          window.ECOMAX_CURRENT_SESSION=s;
          window.ECOMAX_CURRENT_USER=s&&s.user||null;
          resolve(s||null);
        }).catch(function(){resolve(null);});
        return;
      }
      if(++tries>=80){resolve(null);return;}
      setTimeout(check,100);
    }
    check();
  });
})();
