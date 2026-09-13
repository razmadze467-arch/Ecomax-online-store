/* ECOMAX — auth synchronization */
(function(){
  function loadScript(id,src){
    if(document.getElementById(id))return;
    var s=document.createElement('script');
    s.id=id;
    s.src=src;
    s.defer=true;
    document.head.appendChild(s);
  }
  function start(){
    loadScript('ecomaxAuthBootstrap','js/auth-bootstrap.js?v=20260914-1');
    loadScript('ecomaxAuthRedirectFix','js/auth-redirect-fix.js?v=20260914-1');
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else start();
})();
