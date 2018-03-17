var codeclub = {};

$(function(){
    codeclub.radian = 5;
    codeclub.url = 'php/findVenues.php';

    codeclub.clubsSec = $('#clubsSec');
    codeclub.address = $('form input[name="address"]');
    codeclub.radian = $('form select');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    var searchBtn = $('form input[type="submit"]');
    searchBtn.on('click', search);

    codeclub.address.on('keypress', function(e) {
        if(e.which === 13) {
            search(e);
            // e.los();
            codeclub.address.blur();
        }
    })
});

function search(e) {
    e.preventDefault();

    $.ajax({
        contentType : 'application/json',
        url: codeclub.url + "?address=" + encodeURIComponent(codeclub.address.val())
        + "&radian=" + encodeURIComponent(codeclub.radian.val()),
        method: "GET",
        success: success
    });
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    var key = 'AIzaSyAhbioDAOoKEsK3wpuBAgRCp5ja9uvY0aM';

    $.ajax({
        dataType : 'Json',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + encodeURIComponent(lat)
                + ',' + encodeURIComponent(lng) + '&key=' + key,
        method: 'GET'
    }).done(function (data, textStatus, jqXHR) {
        var currentAddr = data.results;
        codeclub.address.val(currentAddr[0].formatted_address);
    });

    $.ajax({
        contentType : 'application/json',
        url: codeclub.url + "?lat=" + encodeURIComponent(lat) + "&lng=" + encodeURIComponent(lng)
                 + "&radian=" + encodeURIComponent(codeclub.radian),
        method: "GET",
        success: success
    });
}

function success(data, textStatus, jqXHR) {
    var clubs = data, name, address, id;
    codeclub.clubsSec.empty();

    if (clubs.length > 0) {
        codeclub.clubsSec.append($('<h2 class="text-center">Search result: ' + clubs.length + '</h2>'));
        clubs.forEach(function(club) {
            console.log(club);
            if (club['Name'])
                name = club.Name;

            if (club['Address'])
                address = club['Address'];

            if (club['City'])
                address += ', ' + club['City'];

            if (club['PostalCode'])
                address += '&nbsp;&nbsp;' + club['PostalCode'];

            if (club['Id'])
                id = club['Id'];

            showClubs(name, address, id);
        });
    }
}

function showClubs(name, address, id) {
    var outterDiv = $('<div class="col-xs-4 padding-xs col-centered"></div>');
    var innerDiv = $('<div class="border-xs center-vertical col-xs-12 border-radius"></div>')
    var header = $('<h4 class="text-center text-capitalize">' + name + '</h4>');
    var location = $('<p class="text-center text-capitalize">' + address + '</p>');
    var contactBtn = $('<p class="text-center"><a href="contactVenueForm.html?club_id=' + encodeURIComponent(id)
             + '" class="btn btn-green">Contact</a></p>');

    innerDiv.append(header).append(location).append(contactBtn);
    outterDiv.append(innerDiv);

    codeclub.clubsSec.append(outterDiv);
}