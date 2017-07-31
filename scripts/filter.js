'use strict';

var g = {};
$(init);

function init(){
//  g.list = document.getElementsByClassName('list')[0];
  //g.list = $('.list');
//  console.log(g.list);
  g.$listItems = $('.list-item');

  g.$province = $('#province');
  g.$province.on('change', filter);
/*
  g.$type = $('#type');
  g.$type.on('change', filter);
*/
  g.$month = $('#month');
  g.$month.on('change', filter);

  g.$notFound = $('#notFound');
  hide(g.$notFound[0], true);

}

/**
 * Filter the base on the user selected on the workshop page
 */
function filter(){
  var provinceSelected = g.$province.children()[g.$province.prop('selectedIndex')].value.toLowerCase().trim();
//  var typeSelected = g.$type.children()[g.$type.prop('selectedIndex')].value.toLowerCase().trim();
  var monthSelected = g.$month.children()[g.$month.prop('selectedIndex')].value.toLowerCase().trim();

  for(var i=0; i<g.$listItems.length; i++){
  //  var type = g.$listItems.eq(i).find('.type')[0];
    var location = g.$listItems.eq(i).find('.location')[0];
    var date = g.$listItems.eq(i).find('.date')[0];

    if(location && location.firstElementChild){
      location = location.firstElementChild.className.toLowerCase().trim();
    } else {
      location = '';
    }
    console.log(date.firstElementChild);
    if(date && date.firstElementChild){
      date = date.firstElementChild.className.toLowerCase().trim();
    } else {
      date = '';
    }

    if(location.indexOf(provinceSelected) > -1
        && date.indexOf(monthSelected) > -1){
      hide(g.$listItems[i], false);
      hide(g.$notFound[0], true);
    } else {
      hide(g.$listItems[i], true);
      hide(g.$notFound[0], false);
    }
  }

//  noItemFond(g.$listItems);
}

function noItemFond(listItems){

  var isDisplay = false;
  for(var i=0; i<listItems.length; i++){
    if(listItems[i].style.display === ''){
      isDisplay = true;
    }
  }

  if(isDisplay == false){
    hide(g.$notFound[0], false);
  }
}

function hide(element, hide){
  if(hide){
    element.style.display = 'none';
  } else {
    element.style.display = '';
  }
}
