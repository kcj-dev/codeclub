
window.CodeClubWorld = {};
$(function() {
  // TODO: add your API key
  CodeClubWorld.api_token = 'ROe90450b2a7fd5fefdaa57c51aead395927510b4ea7b133fe0f298747cc50d8aa';

  // TODO: add your Country Code here
  CodeClubWorld.country_code = 'CA';

  CodeClubWorld.api = 'https://api.codeclubworld.org';
  CodeClubWorld.api_version = '2';

  CodeClubWorld.makeMap();

  CodeClubWorld.region = document.getElementById('region-search');
  CodeClubWorld.region.onchange = CodeClubWorld.makeMap;

  CodeClubWorld.infobox = new google.maps.InfoWindow();

});

CodeClubWorld.makeMap = function() {
//  console.log("makeMap called");
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

    var lat = parseInt(CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-lat"));
    var lng = parseInt(CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-lng"));
    var LatLng = new google.maps.LatLng(lat, lng);

    var dataZ = parseInt(CodeClubWorld.region.options[CodeClubWorld.region.selectedIndex].getAttribute("data-z"));

    var map = new google.maps.Map(el, {
      zoom: dataZ,
      center: LatLng,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
//    console.log(data);
    $.each(clubs, function(i, club) {
      var address = club.venue.address;
      if (!address) return;

      var lat = address.latitude,
          lng = address.longitude;

      if (lat === null || lng === null) return;

      var latLng = new google.maps.LatLng(lat, lng),
          marker = new google.maps.Marker({
            position: latLng,
            icon: 'img/marker.png'
          });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        var infobox = CodeClubWorld.infobox;
        infobox.close();

        var content = [];

        if (club.name){
          content.push('<h5 class="text-green text-uppercase">' + club.name  +'</h5>');
        }

        if (club.venue.address.city) {
          content.push('<p>City: ' + club.venue.address.city + '</p>');
        }

        if (club.venue.address.country) {
          content.push('<p>' + club.venue.address.country.name + '</p>');
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
          content.push('<a class="btn btn-border-green" href="https://www.codeclub.org.uk/start-a-club/volunteers">Volunteer</a>');
        } else {
          content.push('<p><span class="glyphicon glyphicon-remove"></span> Looking for volunteers</p>');
          if (club.venue.url) {
            content.push(
              '<a class="d-block padding-xxs" href="' + club.venue.url + '">' +
                club.venue.url +
              '</a>'
            );
          }
        }



        content = content.join('');

      //  console.log(content);
        infobox.setContent(content);
        infobox.open(map, marker);
      });
    });

    $('.counter').replaceWith(clubs.length);
    // TODO: I've commented out the styles section to make
    // this work in jsbin. Leave the styles section of the
    // mcOptions "as is"
    var mcOptions = {
      gridSize: 30,
      imagePath: 'img/m'
    };

   var markerCluster = new MarkerClusterer(map, markers, mcOptions);

  });
};
