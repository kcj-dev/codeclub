$(function () {

    if (!getUrlVars()['club_id'])
        window.location.replace('findVenues.html');

    var id = getUrlVars()['club_id'];
    $('form input[name="id"]').val(id);


    $.ajax({
        url: "php/findVenues.php?club_id=" + encodeURIComponent(id),
        contentType : 'application/json',
        method: "GET",
        success: success,
        error: error
    });
});

function success(data, textStatus, jqXHR) {
    var club = data;

    $('#clubName').html(club.Name);
    $('#clubAddress').html(club.Address + ', ' + club.City + '&nbsp;&nbsp;&nbsp;' + club.PostalCode);
}

function error(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
}
/**
 * Get the query string in the url
 */
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}