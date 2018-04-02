$(document).ready(function(){

  var owl = $('.owl-carousel');
  owl.owlCarousel({
      items:4,
      loop:true,
      margin:10,
      autoplay:true,
      autoplayTimeout:2000,
      autoplayHoverPause:true,
      responsive:{
        0:{
            items:1,
            nav:false
        },
        768:{
            items:3,
            nav:false
        },
        992:{
            items:4,
            nav:false,
            loop:true
        }
    }
  });
  $('.play').on('click',function(){
      owl.trigger('play.owl.autoplay',[1000])
  })
  $('.stop').on('click',function(){
      owl.trigger('stop.owl.autoplay')
  });
  // Animate on scroll
  new WOW().init();


});

/*====================================================
                        BOX
====================================================*/

$(document).ready(function() {

    $(window).scroll(function() {
      if($(this).scrollTop() > 600){
        $('.to-top2').fadeIn(200);
      } else {
        $('.to-top2').fadeOut(200);
      }
    });
  });// End $


// var owl = $('.owl-carousel');
// owl.owlCarousel({
//     items:4,
//     loop:true,
//     margin:10,
//     autoplay:true,
//     autoplayTimeout:2000,
//     autoplayHoverPause:true
// });
// $('.play').on('click',function(){
//     owl.trigger('play.owl.autoplay',[1000])
// })
// $('.stop').on('click',function(){
//     owl.trigger('stop.owl.autoplay')
// })
