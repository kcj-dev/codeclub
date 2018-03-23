// counter-up js

jQuery(document).ready(function ($) {
    $('.counterup-text span').counterUp({
        delay: 1,
        time: 100
    });
});

// $(document).ready(function(){
//   // Back to top
//   $('#back-to-top').on('click', function (e) {
//       e.preventDefault();
//       $('html,body').animate({
//           scrollTop: 0
//       }, 700);
//   });
// });
