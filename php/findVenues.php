<?php 


    // toronto
    // 45.4973703
    // -73.5710357


    // Name of the csv file to read from
    $file = 'clubs-2018-03-16.csv';
    $delimiter = ',';

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
        $json = getNearbyVenueWithRadian($lat, $lng, $radian);
        header('Content-Type: application/json');
        echo $json;
        exit;
    }

    /**
     * Find all the venues within the radian
     */
    function getNearbyVenueWithRadian($lat, $lng, $radian) { 
        global $file;
        global $delimiter;
        if (($handle = fopen($file, 'r')) === false) {
            die('Error opening file');
        }
    
        $headers = fgetcsv($handle, 1000, $delimiter);
        $csv2json = array();
    
        while ($row = fgetcsv($handle, 1000, $delimiter)) {
            $arraycombine = array_combine($headers, $row);
            $clubLat = floatval($arraycombine['Latitude']);
            $clubLng = floatval($arraycombine['Longitude']);
            $distance = getDistance($lat, $lng, $clubLat, $clubLng);
            $arraycombine += [ 'Distance' => $distance];
            if ($distance <= $radian)
                $csv2json[] = $arraycombine;
        }
    
        // var_dump($csv2json);
        fclose($handle);
        return json_encode($csv2json); 
    }

    /**
     * Get the distance between 2 latitudes and longitutes
     */
    function getDistance($lat1, $lng1, $lat2, $lng2) {
        $R = 6371; //6371 for km, 3959 for mile
        $lat1 = deg2rad($lat1);
        $lng1 = deg2rad($lng1);
        $lat2 = deg2rad($lat2);
        $lng2 = deg2rad($lng2);

        $d = acos(sin($lat1) * sin($lat2) + cos($lat1) * cos($lat2) * cos($lng2 - $lng1)) * $R;
        return $d;
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