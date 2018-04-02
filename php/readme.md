# DAO.php (Data Access Object)
Use this class read the csv and call the below functions:
  - findVenueById($id): find a venue by its id. If there is no venue found, through VenueNotFoundException
  - findVenuesByCountryCode($countryCode): find all venues by the countryCode. If the case of Canada, its country code is "CA".
  - findNearbyVenueWithRadian($lat, $lng, $radian): find all venues which are in the radian of the specified latitude & longitude.
    

# findVenue.php
Use this file to response to the following GET requests:
  - php/findVenue.php?club_id=x (x is the id) : this will response a json of a venue object.
    - Example, findVenue.php?club_id=ca78f9, it will response : 
{Id: "ca78f9", Name: "Bibliothèque Marc-Favreau", Latitude: 45.5319621, Longitude: -73.5973324, Address: "500 Boulevard Rosemont", City: "Montreal", Province:"Québec", PostalCode:"H2S 0C4", CountryCode:"CA", Url:"http://ville.montreal.qc.ca"}

- php/findVenue.php?address=montreal&radian=5 : this will response a json file of the venues array that are within 5km of montreal.
- php/findVenue.php?lat=111111&lng=111111&radian=5 : this will response a json file of the venues array that are within 5 km of latitutde 111111 and longitude 111111.

# emailVenue.php
Use this file to send email:
1/ make a request similar to this: php/emailVenue.php?id=ca78f9&name=Pengkim&email=pengkim@gmail.com&message=ur message

2/ If the email has been successfully sent, it will response { 'email sent': true}. Otherwise, it will response { 'email sent': false}.
