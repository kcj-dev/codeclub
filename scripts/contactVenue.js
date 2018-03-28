var codeclub = {
    errorMsg : "Please fill this"
};

$(function () {

    if (!getUrlVars()['club_id'])
        window.location.replace('findVenues.html');

    var id = getUrlVars()['club_id'];
    codeclub.$id = $('form input[name="id"]');
    codeclub.$id.val(id);

    codeclub.$name = $('form input[name="name"]');
    codeclub.$email = $('form input[type="email"]');
    codeclub.$message = $('form textarea');

    $.ajax({
        url: "php/findVenues.php?club_id=" + encodeURIComponent(id),
        contentType : 'application/json',
        method: "GET",
        success: updateFom,
        error: error
    });

    $('form input[type="submit"]').on('click', sendEmail);
});

/**
 * Update the form to display the club name and address.
 *
 * @param data
 * @param textStatus
 * @param jqXHR
 */
function updateFom(data, textStatus, jqXHR) {
    if (data.error) {
        console.log(data);
    } else {
        var club = data;

        // console.log(club);
        $('#clubName').html(club.Name);
        $('#clubAddress').html(club.Address + ', ' + club.City + '&nbsp;&nbsp;&nbsp;' + club.PostalCode);
    }
}

/**
 * When the submit button clicked, validate all fields in the form, then make
 * a request to php/emailVenue using GET method.
 *
 * @param e
 */
function sendEmail(e) {
    e.preventDefault();

    var name = codeclub.$name.val();
    var email = codeclub.$email.val();
    var message = codeclub.$message.val();

    if (validateInput()){
        $.ajax({
            url: "php/emailVenue.php?id=" + encodeURIComponent(codeclub.$id.val())
                    + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email)
                    + "&message=" + encodeURIComponent(message),
            contentType : 'application/json',
            method: "GET",
            success: displayEmailResponse,
            error: error
        });
    }
}

/**
 * If the response of the request to send email is true, display "an email
 * has been sent!" above the form.
 *
 * @param data
 * @param textStatus
 * @param jqXHR
 */
function displayEmailResponse(data, textStatus, jqXHR) {
    console.log(data);
    if (data['email sent'] && data['email sent'] == true) {
        // $('#emailSent').removeClass('hidden');
        window.location.replace("http://codeclub.ca/thankyou_contact.html");
    }
}

/**
 * Validate the input of the form. All fields can't be empty, and the email
 * input must be email.
 *
 * @returns true if all fields are not empty and email field is email,
 *          otherwise return false;
 */
function validateInput() {
    var name = codeclub.$name.val();
    var email = codeclub.$email.val();
    var message = codeclub.$message.val();

    if (name.length === 0) {
        codeclub.$name.attr('placeholder', codeclub.errorMsg);
        return false;
    }

    if (email.length === 0) {
        codeclub.$email.attr('placeholder', codeclub.errorMsg);
        return false;
    }

    if (message.length === 0) {
        codeclub.$message.attr('placeholder', codeclub.errorMsg);
        return false;
    }

    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        codeclub.$email.val(codeclub.errorMsg);
        return false;
    }

    return true;
}

/**
 * If there is any error from the request, print to the console.
 *
 * @param jqXHR
 * @param textStatus
 * @param errorThrown
 */
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