<?php
  require_once 'DAO.php';
  $file = 'clubs.csv';
  $delimiter = ',';
  $dao = new DAO($file, $delimiter);
  $clubs = $dao->getAllVenues();
  echo json_encode($clubs);
 ?>
