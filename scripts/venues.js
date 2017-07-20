var infoWindow = new google.maps.InfoWindow();
var map, markers = [];

/*
window.CodeClub.maps = {
    ca: {
        minZoomLevel: 3,
        lat:52,
        lng:-101.5
    }
};
*/
window.CodeClubWorld = {};
CodeClubWorld.api_token = 'ROe90450b2a7fd5fefdaa57c51aead395927510b4ea7b133fe0f298747cc50d8aa';
CodeClubWorld.country_code = 'CA';

CodeClubWorld.api = 'https://api.codeclubworld.org';
CodeClubWorld.api_version = '2';

function createInfoWindow(marker, popupContent) {
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(popupContent);
        infoWindow.open(map, this);
    });
}
$(document).ready(function() {
    var mapElement = document.getElementById('map');
//    var mapOptions = window.CodeClub.maps[window.CodeClub.country];
//    console.log(mapOptions);

    map = new google.maps.Map(mapElement, {
        center: {lat: 52, lng: -101.5},
        zoom: 3,
        minZoom: 3
    });

    map.addListener('idle', function() {
        getClubsInView();
    });

    google.maps.event.addListener(infoWindow,'closeclick',function(){
        $(".venue-box.venue-box-hover").removeClass("venue-box-hover");
    });

    $("#region-search").on("change", function() {
        var o = $(this).find("option:selected");

        map.setCenter(new google.maps.LatLng($(o).data("lat"), $(o).data("lng")));
        map.setZoom($(o).data("z"));
    });

    if(document.getElementById("suburb-search")) {
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById("suburb-search"), {
            types: ['(regions)']
        });
        autocomplete.setComponentRestrictions({'country': ['au']});

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }
        });
    }

    $.ajax({
      method      : 'GET',
      url         : CodeClubWorld.api + '/clubs?in_country=' + CodeClubWorld.country_code,
      contentType : 'application/json',
      headers     : { 'Authorization': 'Bearer ' + CodeClubWorld.api_token, 'Accept': 'application/vnd.codeclubworld.v'+CodeClubWorld.api_version }
    })
    .done(function(e) {
        $.each(e.clubs, function(ix, club) {
            var latlng = new google.maps.LatLng(club.lat, club.lon);

            var finalLatLng = latlng;

            if (markers.length !== 0) {
                for (var i = 0; i < markers.length; i++) {
                    var existingMarker = markers[i];
                    var pos = existingMarker.getPosition();

                    if (latlng.equals(pos)) {

                        var newLat = latlng.lat() + (Math.random() -.5) / 1500;
                        var newLng = latlng.lng() + (Math.random() -.5) / 1500;
                        finalLatLng = new google.maps.LatLng(newLat, newLng);
                    }
                }
            }

            var marker = new google.maps.Marker({
                position: finalLatLng,
                club: club,
                icon: '/img/marker.png'
            });

            var popupContent = createClubInfoWindow(club);

            createInfoWindow(marker, popupContent);
            markers.push(marker);
        });
        var markerCluster = new MarkerClusterer(map, markers, {
            imagePath: '/img/m1.png'
        });
    });
});

function getClubsInView() {
    var html = "";
    for(var i = markers.length, bounds = map.getBounds(); i--;) {
        if(bounds.contains(markers[i].getPosition())) {
            html += createClubBox(markers[i].club);
        }
    }

    if(html.length === 0) {
        html = "<div class='venue-list-no-clubs'>Sorry, no clubs could be found in this area</div>";
    }

    $("#venue-list").empty().html(html);
}

function createClubInfoWindow(club) {
    var r = '<div class="club-marker">' +
    '<div class="club-name">' + club.name + '</div>';

    var accept = false;
    if(club.sessions.length) {
        for(var i = 0; i < club.sessions.length; i++) {
            if(club.sessions[i].open) {
                accept = true;
                r += '<div class="venue-session">'+club.sessions[i].day+' at '+club.sessions[i].time+'</div>';
            }
        }

        if(accept) {
            r += '<p>&#10004; Accepting new students<br>';
        } else {
            r += '<p>&#10008; Not accepting new students<br>';
        }
    } else {
        r += '<p>&#10008; Contact venue host for sessions<br>';
    }

    if(club.can_volunteer) {
        r += "&#10004; Needing volunteers</p>";
    } else {
        r += "&#10008; Not needing volunteers</p>";
    }

    if(club.only_school_students) {
        r += "&#10004; Only students from this school accepted</p>";
    }

    if(window.CodeClub.country === "au") {
        r += "<a href='/ajax/clubs/enquiry?id="+club.id+"' data-toggle='modal' data-target='#enquireModal' class='c-button c-button--green c-button--small u-margin-top--small u-margin-bottom--small'>Enquire</a> ";
    } else {
        r += "<a href='/enrol/"+club.id+"' class='c-button c-button--green c-button--small u-margin-top--small u-margin-bottom--small'>Join</a> ";
    }

    r += "<a href='/enrol/"+club.id+"' class='c-button c-button--green c-button--small u-margin-top--small u-margin-bottom--small'>Volunteer</a>" +
    '</div>';

    return r;
}
function createClubBox(club) {
    return '<div class="venue-box" data-id="'+club.id+'"><div class="venue-name"><a href="/join/' + club.id + '">' + club.name + '</a></div><div class="venue-sessions">'+club.address+'</div></div>';
}
