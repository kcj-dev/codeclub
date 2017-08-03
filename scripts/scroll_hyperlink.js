'use strict';
var g = {};

$(function(){
  g.s = document.getElementsByClassName('custom-border-green-disck');
  g.$type = $('#type');

  if(g.s){
    $(g.s).click(scroll);
  }
});

function scroll(e){
  g.target = e.target;
  var item = $(g.target).attr('value');
  var positionabout = $(item).offset().top - 90;
  $("html, body").animate({scrollTop:positionabout}, '0', 'swing');
}
