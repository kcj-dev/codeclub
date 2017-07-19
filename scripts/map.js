
window.CodeClubWorld = {};
$(function() {
  // TODO: add your API key
  CodeClubWorld.api_token = 'ROe90450b2a7fd5fefdaa57c51aead395927510b4ea7b133fe0f298747cc50d8aa';

  // TODO: add your Country Code here
  CodeClubWorld.country_code = 'CA';

  CodeClubWorld.api = 'https://api.codeclubworld.org';
  CodeClubWorld.api_version = '2';

  CodeClubWorld.makeMap();

  CodeClubWorld.region = document.getElementById('region');
  CodeClubWorld.region.onchange = CodeClubWorld.makeMap;

  CodeClubWorld.infobox = new google.maps.InfoWindow({
    disableAutoPan: false,
    maxWidth: 150,
    pixelOffset: new google.maps.Size(-140, -250),
    zIndex: null,
    boxStyle: {
      background: '#fff',
      width: '280px',
      height: '200px',
      padding: '0 10px'
    },
    infoBoxClearance: new google.maps.Size(1, 1),
    closeBoxURL: '/img/map/close.png',
    closeBoxMargin: '10px 0 0 0'
  });
});

CodeClubWorld.makeMap = function() {
  console.log("makeMap called");
  var el = document.getElementById('map');
  //console.log(el);
  if (!el) return;

  $.ajax({
    method      : 'GET',
    url         : CodeClubWorld.api + '/clubs?in_country=' + CodeClubWorld.country_code,
    contentType : 'application/json',
    headers     : { 'Authorization': 'Bearer ' + CodeClubWorld.api_token, 'Accept': 'application/vnd.codeclubworld.v'+CodeClubWorld.api_version }
  })
  .done( function(data) {
    var clubs = data,
        markers = [];

    var LatLng = new google.maps.LatLng(55, -90);
    var lat = CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-lat");
    var lng = CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-lng");
    console.log(lat + ' ' + lng);
    var map = new google.maps.Map(el, {
      zoom: 3,
      center: LatLng,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    //console.log(data);
    $.each(clubs, function(i, club) {
      var address = club.venue.address;
      if (!address) return;

      var lat = address.latitude,
          lng = address.longitude;

      if (lat === null || lng === null) return;

      var latLng = new google.maps.LatLng(lat, lng),
          marker = new google.maps.Marker({
            position: latLng
          /*  icon: '/img/map/marker.png'*/
          });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        var infobox = CodeClubWorld.infobox;

        infobox.close();

        var content = [];

        content.push('<h5 class="name">' + club.name  +'</h5>');

        if (club.venue.address.city) {
          content.push('<p class="city">' + club.venue.address.city + '</p>');
        }

        if (club.venue.address.country.name) {
          content.push('<p class="country">' + club.venue.address.country.name + '</p>');
        }

        if (club.url) {
          content.push(
            '<a class="website" href="' + club.url + '">' +
              club.url +
            '</a>'
          );
        }

        content = content.join('');

        infobox.setContent(content);
        infobox.open(map, marker);
      });
    });

    $('.counter').append(clubs.length);
    // TODO: I've commented out the styles section to make
    // this work in jsbin. Leave the styles section of the
    // mcOptions "as is"
    var mcOptions = {
      gridSize: 30,
    };

  /*  var markerCluster = new google.maps.Marker(markers, mcOptions);
    markerCluster.setMap(map);*/

    for(var i=0; i<markers.length; i++){
      markers[i].setMap(map);
    }
  });
};
