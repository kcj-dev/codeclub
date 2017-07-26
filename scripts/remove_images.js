var g = {};
$(document).ready(function() {

  g.img = document.getElementsByClassName("after-nav")[0].getElementsByTagName("img");
  checkwindowSize();
  $(window).resize(function(){
    checkwindowSize();
  });
});
function checkwindowSize (){
  if($(window).width() < 850 || $(document).width() < 1000){
    $(g.img[0]).hide();
    $(g.img[1]).hide();
  } else if ($(window).width() > 850 || $(document).width() > 1000) {
    $(g.img[0]).show();
    $(g.img[1]).show();
  }
}
