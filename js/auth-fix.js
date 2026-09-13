/* ECOMAX — auth compatibility bridge
   IMPORTANT: this file NEVER creates a second Supabase client. */
(function(){
  const client = window.ECOMAX_SUPABASE_CLIENT;
  if(!client || !client.auth) {
    console.warn("ECOMAX Auth: shared Supabase client is not ready");
    return;
  }

  window.ECOMAX_AUTH_CLIENT = client;

  if(!window.ECOMAX_AUTH_READY){
    window.ECOMAX_AUTH_READY = client.auth.getSession()
      .then(function(r){
        const session = r && r.data ? r.data.session : null;
        window.ECOMAX_CURRENT_SESSION = session || null;
        window.ECOMAX_CURRENT_USER = session && session.user || null;
        return session || null;
      })
      .catch(function(){
        window.ECOMAX_CURRENT_SESSION = null;
        window.ECOMAX_CURRENT_USER = null;
        return null;
      });
  }
})();
