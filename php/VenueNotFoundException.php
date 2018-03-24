<?php
/**
 * Created by PhpStorm.
 * User: KimHyonh
 * Date: 3/24/2018
 * Time: 10:12 AM
 */

class VenueNotFoundException extends Exception {

    public function errorMessage()
    {
        //error message
        $errorMsg = 'Error on line ' . $this->getLine() . ' in ' . $this->getFile()
            . ': <b>' . $this->getMessage();
        return $errorMsg;
    }

}
