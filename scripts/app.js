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
