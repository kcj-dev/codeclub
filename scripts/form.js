var g = {};

$(function(){
  g.email = $('form input[type^=text]');
  g.submitBtn = $('form input[type^=button]');

  if(g.email){
    g.email.keypress(function(e){
      if(e.which == 13){
      //  e.preventDefault();
        return signup_handler(e);
      }
    });
  }
  if(g.submitBtn){
    g.submitBtn.click(signup_handler);
  }

  var cookie = $.cookie('email');
  if(cookie){
    $('form input[type^=email]').val(cookie);
  }

});

function signup_handler(event){
  event.preventDefault();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(g.email.val() !== '' && regex.test(g.email.val())){
    $.cookie('email', g.email.val(), {expire: 7});
    window.location.replace('../contact.html#mc_embed_signup');
  } else {
    var error = $('.error');
    if(error){
      error.replaceWith('<p class="error text-s"> Email is invalid!!! </p>');
    }
  }
}
