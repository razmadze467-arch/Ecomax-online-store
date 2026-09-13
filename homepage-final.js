document.addEventListener('DOMContentLoaded', function(){
  var footer=document.querySelector('footer.footer');
  if(footer){
    footer.querySelectorAll('.footer-bottom').forEach(function(x){x.remove();});
  }
});