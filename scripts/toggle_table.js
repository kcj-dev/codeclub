
$('document').ready(function(){
  var $scratch1 = $('#scratch1Btn');
  var $scratch2 = $('#scratch2Btn');
  var $webdev1Btn = $('#webdev1Btn');
  var $webdev2Btn = $('#webdev2Btn');
  var $python1Btn = $('#python1Btn');
  var $python2Btn = $('#python2Btn');

  $scratch1.click(addActive);
  $scratch1.click(function(){
    $scratch2.removeClass('active');
  });

  $scratch2.click(addActive);
  $scratch2.click(function(){
    $scratch1.removeClass('active');
  });

  $webdev1Btn.click(addActive);
  $webdev1Btn.click(function(){
    $webdev2Btn.removeClass('active');
  });

  $webdev2Btn.click(addActive);
  $webdev2Btn.click(function(){
    $webdev1Btn.removeClass('active');
  });

  $python1Btn.click(addActive);
  $python1Btn.click(function(){
    $python2Btn.removeClass('active');
  });

  $python2Btn.click(addActive);
  $python2Btn.click(function(){
    $python1Btn.removeClass('active');
  });
});

function addActive(e){
  //e.preventDefault();
//  removeActive();
  var $btn = $(this);
  $btn.tab('show')
  $btn.addClass('active');
//  console.log($btn.parent().children().length);
}

function removeActive($btn){
  var btns = $btn.parent().children();
  btns.removeClass('active');
//  console.log(btns);
  /*for(var i=0; i<btns.length; i++){
    btns[i]
  }*/
}
