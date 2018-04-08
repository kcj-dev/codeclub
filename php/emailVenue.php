<?php
    require_once 'DAO.php';

    date_default_timezone_set ('America/Montreal');
    // Name of the csv file to read from
    $file = 'clubs.csv';
    $delimiter = ',';

    $headers = "MIME-Version: 1.0" . "\r\n";
//    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <ross@kidscodejeunesse.org>' . "\r\n";
//    $headers .= 'Cc: <info@codeclub.ca>' . "\r\n";

    $subject = "Code Club Volunteer Request";
    $body = '';

    $dao = new DAO($file, $delimiter);

    $response = array();

    $id = '';
    $name = '';
    $email = '';
    $message = '';


    if (isset($_GET['name']) && !empty($_GET['name'])) {
        $name = htmlentities($_GET['name']);
    }

    if (isset($_GET['email']) && !empty($_GET['email'])) {
        $email = htmlentities($_GET['email']);
    }

    if (isset($_GET['message']) && !empty($_GET['message'])) {
        $message = htmlentities($_GET['message']);
    }


    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = htmlentities($_GET['id']);

        try {
            $venue = $dao->findVenueById($id);
        } catch (VenueNotFoundException $e) {
            $response = [
              "error" => "Venue not found!"
            ];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }

        // The body of the email that will be sent
        $body .= $name . " is looking for a volunteer opportunity. \r\n\r\n";
        $body .= "Message: $message \r\n\r\n\r\n";
        $body .= "Volunteer's email: $email";

//        $venue->getEmail()
        if (@mail($venue->getEmail(), $subject, $body, $headers)) {
            $response = [
                'email sent' => true
            ];

            $now = date("Y-m-d H:i:s");
            $venueName = $venue->getName();
            unset($volunteerInfo);
            $volunteerInfo =  [$name,$email,$venueName,$now];
            $file = fopen("volunteerLog.csv","a");
            fputs($file,"\r\n" . implode($volunteerInfo, ','));
            fclose($file);
        } else {
            $response = [
                'email sent' => false
            ];
        }

        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
?>