(function(){
  var c=window.ECOMAX_SUPABASE_CLIENT;
  if(!c||!c.auth)return;
  window.ECOMAX_AUTH_CLIENT=c;
  function read(){return c.auth.getSession().then(function(r){var s=r&&r.data?r.data.session:null;window.ECOMAX_CURRENT_SESSION=s;window.ECOMAX_CURRENT_USER=s&&s.user||null;return s;}).catch(function(){return null;});}
  function wait(){return new Promise(function(resolve){var n=0;function t(){read().then(function(s){if(s||n++>=32)return resolve(s);setTimeout(t,250);});}t();});}
  if(!window.ECOMAX_AUTH_READY)window.ECOMAX_AUTH_READY=wait();
  c.auth.onAuthStateChange(function(e,s){
    window.ECOMAX_CURRENT_SESSION=s||null;
    window.ECOMAX_CURRENT_USER=s&&s.user||null;
    if(e==='SIGNED_IN'&&s){try{var x=localStorage.getItem('ecomax-auth');if(x)localStorage.setItem('sb-mkxkqdvtmfbxmldnvsef-auth-token',x);}catch(q){} if(/\/login\.html$/.test(location.pathname)){var p=new URLSearchParams(location.search),r=p.get('redirect'),t='account.html';if(r&&/\.html$/.test(r)&&r.indexOf('://')<0&&!/^\/\//.test(r))t=r;setTimeout(function(){location.replace(t);},200);}}
    if(e==='SIGNED_OUT'){try{localStorage.removeItem('ecomax-auth');localStorage.removeItem('sb-mkxkqdvtmfbxmldnvsef-auth-token');}catch(q){}}
  });
})();
