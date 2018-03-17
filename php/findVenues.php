<?php
    require_once 'DAO.php';
    // Name of the csv file to read from
    $file = 'clubs-2018-03-16.csv';
    $delimiter = ',';

    $dao = new DAO($file, $delimiter);

    // detault latitute & longitude to Montreal
    $lat = 45.501689;
    $lng = -73.567256;   

    // Default radian to 5km
    $radian = 5; 

    if (isset($_GET['lat']) && is_numeric($_GET['lat']))
        $lat = $_GET['lat'];

    if (isset($_GET['lng']) && is_numeric($_GET['lng']))
        $lng = $_GET['lng'];

    if (isset($_GET['address']) && !empty($_GET['address'])) {
        $address = $_GET['address'];
        $latlng = getLatLngFromAdress($address);
        $lat = $latlng['lat'];
        $lng = $latlng['lng'];
    }
    
    if (isset($_GET['radian']) && is_numeric($_GET['radian'])) {
        $radian = $_GET['radian'];
        $json = $dao->getNearbyVenueWithRadian($lat, $lng, $radian);
        header('Content-Type: application/json');
        echo json_encode($json);
        exit;
    }

    if (isset($_GET['club_id'])) {
        $id = $_GET['club_id'];
        $venue = $dao->findVenueById($id);

        header('Content-Type: application/json');
        echo json_encode($venue);
        exit;
    }

    /**
     * Get Latitude and Longitude from $address
     * Return a key-value pair array with the key 'lat', 'lng'
     */
    function getLatLngFromAdress($address) {
        $address = urlencode($address);
        $key = 'AIzaSyB1MuasT6yZuMYGxOIqE12rfZZygfIWgyM';
        // $key = 'AIzaSyAhbioDAOoKEsK3wpuBAgRCp5ja9uvY0aM';
        $googleApi = "https://maps.google.com/maps/api/geocode/xml?address=$address&sensor=false&key=$key";
        $googleXml = getXml($googleApi);

        $locations = $googleXml->getElementsByTagName('location');
        $latLng = [];
        foreach($locations as $location) {
            $latLng['lat'] = $location->getElementsByTagName('lat')->item(0)->nodeValue;
            $latLng['lng'] = $location->getElementsByTagName('lng')->item(0)->nodeValue;
        }

        return $latLng;
    }
    
    /**
     * Get a DOMDoucment object from the $url
     */
    function getXml($url) {
        $results = file_get_contents($url);
        $xml = new \DOMDocument();
        @$xml->loadXML($results);

        return $xml;
    }
?>