<?php
    require_once 'DAO.php';
    // Name of the csv file to read from
    $file = 'clubs-2018-03-16.csv';
    $delimiter = ',';

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <pengkim.badboy@gmail.com>' . "\r\n";
//    $headers .= 'Cc: myboss@example.com' . "\r\n";

    $subject = "Volunteer Opportunity";
    $body = '';

    $dao = new DAO($file, $delimiter);

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

        $venue = $dao->findVenueById($id);

        $body .= $name . "is looking for an volunteer opportunity. \r\n";
        $body .= "Message: \r\n $message";

        echo $venue->getEmail();
        mail("pengkim.badboy@gmail.com", $subject, $body, $headers);
    }
?>