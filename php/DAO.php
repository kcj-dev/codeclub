<?php
    require_once 'Venue.php';
    require_once 'VenueNotFoundException.php';


    class DAO {

        private $file;
        private $delimiter;

        /**
         * DAO constructor.
         * @param $file
         * @param $delimiter
         */
        public function __construct($file, $delimiter)
        {
            $this->file = $file;
            $this->delimiter = $delimiter;
        }

        /**
         * Find a venue by id
         *
         * @param $id
         * @return Venue
         * @throws VenueNotFoundException
         */
        function findVenueById($id) {
            if (($handle = fopen($this->file, 'r')) === false) {
                die('Error opening file');
            }

            $headers = fgetcsv($handle, 1000, $this->delimiter);

            while ($row = fgetcsv($handle, 1000, $this->delimiter)) {
                $arraycombine = array_combine($headers, $row);
                $clubId = $arraycombine['Id'];
                if (strtolower($arraycombine['Verified']) == 'true' && $id === $clubId) {
                    $venue = new Venue($arraycombine['Id'], $arraycombine['Name'], $arraycombine['Address 1']
                        , $arraycombine['City'], $arraycombine['Region'], $arraycombine['Country code'], $arraycombine['Postcode']
                        , floatval($arraycombine['Latitude']), floatval($arraycombine['Longitude'])
                        , $arraycombine['Contact email'], $arraycombine['Url']);
                    break;
                }
            }

            if (!isset($venue)) {
                throw new VenueNotFoundException("no venue found!");
            }
            // var_dump($venue);
            fclose($handle);
            return $venue;
        }

        /**
         * Find all the venues
         */
        function getVenuesByCountryCode($countryCode) {
            if (($handle = fopen($this->file, 'r')) === false) {
                die('Error opening file');
            }

            $headers = fgetcsv($handle, 1000, $this->delimiter);
            $venues = array();

            while ($row = fgetcsv($handle, 1000, $this->delimiter)) {
                $arraycombine = array_combine($headers, $row);

                $venue = new Venue($arraycombine['Id'], $arraycombine['Name'], $arraycombine['Address 1']
                    , $arraycombine['City'], $arraycombine['Region'], $arraycombine['Country code'], $arraycombine['Postcode']
                    , floatval($arraycombine['Latitude']), floatval($arraycombine['Longitude'])
                    , $arraycombine['Contact email'], $arraycombine['Url']);

                if (strtolower($arraycombine['Verified']) == 'true')
                    $venues[] = $venue;
            }

            fclose($handle);
            return $venues;
        }

        /**
         * Find all the venues within the radian
         * @param $lat
         * @param $lng
         * @param $radian
         * @return string
         */
        function getNearbyVenueWithRadian($lat, $lng, $radian) {
            if (($handle = fopen($this->file, 'r')) === false) {
                die('Error opening file');
            }

            $headers = fgetcsv($handle, 1000, $this->delimiter);
            $venues = array();

            while ($row = fgetcsv($handle, 1000, $this->delimiter)) {
                $arraycombine = array_combine($headers, $row);

                $venue = new Venue($arraycombine['Id'], $arraycombine['Name'], $arraycombine['Address 1']
                    , $arraycombine['City'], $arraycombine['Region'], $arraycombine['Country code'], $arraycombine['Postcode']
                    , floatval($arraycombine['Latitude']), floatval($arraycombine['Longitude'])
                    , $arraycombine['Contact email'], $arraycombine['Url']);

                $distance = $this->calculateDistanceBetween2LatAndLng($lat, $lng, $venue->getLat(), $venue->getLng());
                if (strtolower($arraycombine['Verified']) == 'true' && $distance <= $radian)
                    $venues[] = $venue;
            }

            fclose($handle);
            return $venues;
        }


        /**
         * Get the distance between 2 latitudes and longitutes
         */
        private function calculateDistanceBetween2LatAndLng($lat1, $lng1, $lat2, $lng2) {
            $R = 6371; //6371 for km, 3959 for mile
            $lat1 = deg2rad($lat1);
            $lng1 = deg2rad($lng1);
            $lat2 = deg2rad($lat2);
            $lng2 = deg2rad($lng2);

            $d = acos(sin($lat1) * sin($lat2) + cos($lat1) * cos($lat2) * cos($lng2 - $lng1)) * $R;
            return $d;
        }
    }
