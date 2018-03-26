var g = {};
/**
* Main function that will run once the DOM is fully loaded
*
*/
$(function() {
  g.path = "./";
  if ($('#language .active a').html() !== 'EN') {
    g.path = '../';
  }
  g.region = document.getElementById('region-search');
  g.infobox = new google.maps.InfoWindow();
  g.file = g.request = createRequestObject();
  g.file.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        g.res = JSON.parse(this.responseText);
        makeMap();
        if(g.region){
          g.region.onchange = makeMap;
        }

    }
  };
  g.file.open("GET", "php/clubsJson.php", true);
  g.file.send();
});

/**
* Logical function, responsible for creating the map,
* markers and placing the information from the json onto
* the marker info box.
*
*/
function makeMap() {
  var clubs = g.res, lat, lng, dataZ, LatLng
      markers = [];
  console.log(clubs.length);
  // console.log(clubs);
  //checks if there is a province selected in the select tag.
   if(g.region){
     lat = parseInt(g.region.options[g.region.selectedIndex].getAttribute("data-lat"));
     lng = parseInt(g.region.options[g.region.selectedIndex].getAttribute("data-lng"));
     dataZ = parseInt(g.region.options[g.region.selectedIndex].getAttribute("data-z"));
     LatLng = new google.maps.LatLng(lat, lng);
   } else {
     dataZ = 4;
     LatLng = new google.maps.LatLng(52.0, -95.5);
   }

  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: dataZ,
      center: LatLng,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    $.each(g.res, function(i, club) {
      var address = club.Address;
      if (!address) return;

      var lat = club.Latitude,
          lng = club.Longitude;

      if (lat === null || lng === null) return;
      var latLng = new google.maps.LatLng(lat, lng),
          marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: g.path + 'img/marker.png'
      });//end of setting the marker
      if(club.Name !== 'Hamilton Code Club' && club.Name !== 'IEC of Hamilton'
                    && club.CountryCode === 'CA'){
          // console.log(club);
        markers.push(marker);
      }
      google.maps.event.addListener(marker, 'click', function() {
        var infobox = g.infobox;
        infobox.close();

        var content = [];
        // the following if statments will check if the information is availabke
        // for said club and if it is places it onto the info box of said marker.
        if (club.Name){
          content.push('<h5 class="text-green text-uppercase">' + club.Name  +'</h5>');
        }

        if (club.City) {
          content.push('<p>City: ' + club.City + '</p>');
        }
        if (club.Name) {
          content.push('<p>Name: ' + club.Name + '</p>');
        }
        if (club.Address) {
          content.push('<p>Addres: ' + club.Address + '</p>');
        }
        if (club.PostalCode) {
          content.push('<p>PostalCode: ' + club.PostalCode + '</p>');
        }
        if (club.Url) {
          content.push('<a target="_blank" href="' + club.Url + '">' + club.Url + '</a>');
        }
          if (club.Id) {
              content.push('<p><a class="btn btn-green" href="contactVenueForm.html?club_id=' + club.Id + '">Contact</a></p>');
          }

        content = content.join('');
        infobox.setContent(content);
        infobox.open(map, marker);
      });//end of addListener
    });//end of foreach
    $('.counter').replaceWith(clubs.length);
    var mcOptions = {
      gridSize: 35,
      imagePath: g.path + 'img/m'
    };

   var markerCluster = new MarkerClusterer(map, markers, mcOptions);
}

/**
* Helper function that creates a cross browser compatible object
* of a request object.
*
*/
function createRequestObject() {
  var request;
  if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
  } else {
		request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return request;
}
