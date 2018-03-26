
window.CodeClubWorld = {};
$(function() {
  CodeClubWorld.api_token = 'ROe90450b2a7fd5fefdaa57c51aead395927510b4ea7b133fe0f298747cc50d8aa';

  CodeClubWorld.country_code = 'CA';

  CodeClubWorld.api = 'https://api.codeclubworld.org';
  CodeClubWorld.api_version = '2';

  CodeClubWorld.makeMap();

  CodeClubWorld.region = document.getElementById('region-search');
  if(CodeClubWorld.region){
    CodeClubWorld.region.onchange = CodeClubWorld.makeMap;
  }
  CodeClubWorld.infobox = new google.maps.InfoWindow();

  if ($('#language .active a').html() !== 'EN')
    CodeClubWorld.path = '../';
  else
    CodeClubWorld.path = './';

  console.log(CodeClubWorld.path);
});

CodeClubWorld.makeMap = function() {
  var el = document.getElementById('map');
  if (!el) return;

  $.ajax({
    method      : 'GET',
    url         : CodeClubWorld.api + '/clubs?in_country=' + CodeClubWorld.country_code,
    contentType : 'application/json',
    headers     : { 'Authorization': 'Bearer ' + CodeClubWorld.api_token, 'Accept': 'application/vnd.codeclubworld.v'+CodeClubWorld.api_version }
  })
  .done( function(data) {
    var clubs = data, lat, lng, dataZ, LatLng
        markers = [];

   console.log(clubs);
    if(CodeClubWorld.region){
      lat = parseInt(CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-lat"));
      lng = parseInt(CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-lng"));
      dataZ = parseInt(CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-z"));
      LatLng = new google.maps.LatLng(lat, lng);
    } else {
      dataZ = 4;
      LatLng = new google.maps.LatLng(52.0, -95.5);
    }

    var map = new google.maps.Map(el, {
      zoom: dataZ,
      center: LatLng,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $.each(clubs, function(i, club) {
      // console.log(club);

      var address = club.venue.address;
      if (!address) return;

      var lat = address.latitude,
          lng = address.longitude;

      if (lat === null || lng === null) return;

      // if(club.venue.address.city === 'Surrey') {
      //   console.log(club);
      //   // console.log(lat + " " + lng);
      // }

      var latLng = new google.maps.LatLng(lat, lng),
          marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: CodeClubWorld.path + 'img/marker.png'
          });

      if(club.name !== 'Hamilton Code Club' && club.name !== 'IEC of Hamilton'){
        markers.push(marker);
      }

      google.maps.event.addListener(marker, 'click', function() {
        var infobox = CodeClubWorld.infobox;
        infobox.close();

        console.log(club.name);
        console.log(marker.position.lat() + " " + marker.position.lng());

        var content = [];

        if (club.name){
          content.push('<h5 class="text-green text-uppercase">' + club.name  +'</h5>');
        }

        if (club.venue.address.city) {
          content.push('<p>City: ' + club.venue.address.city + '</p>');
        }

        if (club.looking_for_volunteer == true) {
          content.push('<p><span class="glyphicon glyphicon-ok"></span> Looking for volunteers</p>');
          if (club.venue.url) {
            content.push(
              '<a class="d-block padding-xxs" href="' + club.venue.url + '">' +
                club.venue.url +
              '</a>'
            );
          }
          content.push('<a class="btn btn-border-green" target="_blank" href="http://codeclub.ca/volunteer.html">Volunteer</a>');
        } 

        if (club.venue.url) {
          content.push('<a target="_blank" href="' + club.venue.url + '">' + club.venue.url + '</a>');
        }

        content = content.join('');
        infobox.setContent(content);
        infobox.open(map, marker);
      });
    });

    $('.counter').replaceWith(clubs.length);
    var mcOptions = {
      gridSize: 35,
      imagePath: CodeClubWorld.path + 'img/m'
    };

   var markerCluster = new MarkerClusterer(map, markers, mcOptions);

  });
};