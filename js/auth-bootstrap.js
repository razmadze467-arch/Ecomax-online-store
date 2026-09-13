/* ECOMAX — reliable auth bootstrap */
(function(){
  if(window.ECOMAX_AUTH_BOOTSTRAP_READY)return;
  var SHARED='ecomax-auth';
  var LEGACY='sb-mkxkqdvtmfbxmldnvsef-auth-token';
  function syncStorage(){
    try{
      var a=localStorage.getItem(SHARED);
      var b=localStorage.getItem(LEGACY);
      if(!a&&b)localStorage.setItem(SHARED,b);
      if(a&&!b)localStorage.setItem(LEGACY,a);
    }catch(e){}
  }
  syncStorage();
  window.ECOMAX_AUTH_BOOTSTRAP_READY=new Promise(function(resolve){
    var tries=0;
    function check(){
      var client=window.ECOMAX_SUPABASE_CLIENT||window.ECOMAX_AUTH_CLIENT;
      if(client&&client.auth){
        window.ECOMAX_AUTH_CLIENT=client;
        function read(){
          return client.auth.getSession().then(function(r){
            var s=r&&r.data?r.data.session:null;
            window.ECOMAX_CURRENT_SESSION=s||null;
            window.ECOMAX_CURRENT_USER=s&&s.user||null;
            syncStorage();
            return s||null;
          });
        }
        read().then(function(s){
          if(s){resolve(s);return;}
          setTimeout(function(){read().then(resolve).catch(function(){resolve(null);});},500);
        }).catch(function(){resolve(null);});
        return;
      }
      if(++tries>=100){resolve(null);return;}
      setTimeout(check,50);
    }
    check();
  });
})();
