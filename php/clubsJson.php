<?php
  require_once 'DAO.php';
  $file = 'clubs.csv';
  $delimiter = ',';
  $dao = new DAO($file, $delimiter);
  $clubs = $dao->findVenuesByCountryCode('CA');
  header('Content-Type: application/json');
  echo json_encode($clubs);
?>
