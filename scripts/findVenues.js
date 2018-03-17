var codeclub = {};

$(function(){
    codeclub.radian = 5;
    codeclub.url = 'php/findVenues.php';

    codeclub.clubsSec = $('#clubsSec');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    var searchBtn = $('form input[type="submit"]');
    searchBtn.on('click', function(e){
        e.preventDefault();
        var address = $('form input[name="address"]').val();
        var radian = $('form select').val();

        $.ajax({
            contentType : 'application/json',
            url: codeclub.url + "?address=" + encodeURIComponent(address) 
                    + "&radian=" + encodeURIComponent(radian),
            method: "GET",
            success: success
        });
    });
});

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

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
    console.log(clubs);

    clubs.forEach(function(club) {
        console.log(club);
        if (club['Name'])
            name = club.Name;

        if (club['Address'])
            address = club['Address'];

        if (club['City'])
            address += ', ' + club['City'];

        if (club['PostalCode'])
            address += '  ' + club['PostalCode'];

        if (club['Id'])
            id = club['Id'];

        showClubs(name, address, id);
    });
}

function showClubs(name, address, id) {
    var div = $('<div class="col-xs-4 border"></div>');
    var header = $('<h4 class="text-center">' + name + '</h4>');
    var location = $('<p class="text-center">' + address + '</p>');
    var contactBtn = $('<a href="contactVenueForm.html?club_id=' + encodeURIComponent(id)
             + '" class="btn btn-green">Contact</a>');

    div.append(header).append(location).append(contactBtn);
    codeclub.clubsSec.append(div);
}