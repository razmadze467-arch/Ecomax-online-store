/* ECOMAX — unified browser auth bridge */
(function(){
  const URL = "https://mkxkqdvtmfbxmldnvsef.supabase.co";
  const KEY = "sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd";
  const SHARED = "ecomax-auth";
  const DEFAULT = "sb-mkxkqdvtmfbxmldnvsef-auth-token";

  function migrate(){
    try{
      const shared=localStorage.getItem(SHARED);
      const legacy=localStorage.getItem(DEFAULT);
      if(!shared && legacy) localStorage.setItem(SHARED,legacy);
      if(shared && !legacy) localStorage.setItem(DEFAULT,shared);
    }catch(e){}
  }

  migrate();

  if(!window.supabase || typeof window.supabase.createClient !== "function") return;
  if(window.ECOMAX_AUTH_CLIENT) return;

  const original=window.supabase.createClient.bind(window.supabase);
  const client=original(URL,KEY,{
    auth:{
      storageKey:SHARED,
      persistSession:true,
      autoRefreshToken:true,
      detectSessionInUrl:true
    }
  });

  window.ECOMAX_AUTH_CLIENT=client;
  window.ECOMAX_SUPABASE_CLIENT=client;

  client.auth.onAuthStateChange(function(event,session){
    try{
      if(session){
        const raw=localStorage.getItem(SHARED);
        if(raw) localStorage.setItem(DEFAULT,raw);
      }else if(event === "SIGNED_OUT"){
        localStorage.removeItem(SHARED);
        localStorage.removeItem(DEFAULT);
      }
    }catch(e){}
    window.dispatchEvent(new CustomEvent("ecomax-auth-change",{detail:{event:event,session:session||null,user:session&&session.user||null}}));
  });

  window.ECOMAX_AUTH_READY=client.auth.getSession().then(function(r){
    const session=r && r.data ? r.data.session : null;
    window.ECOMAX_CURRENT_SESSION=session||null;
    window.ECOMAX_CURRENT_USER=session&&session.user||null;
    return session||null;
  }).catch(function(){return null;});
})();
