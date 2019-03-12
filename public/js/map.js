// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var loc = {lat: 28.5110641, lng: 77.0630248};

function initMap() {

 infowindow = new google.maps.InfoWindow();


}


var image = './assets/doctor-icon.png';


function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc,
    icon: image
  });

  google.maps.event.addListener(marker, 'click', function() {
     infowindow.open(map, this);
    infowindow.setContent(place.name);
  });
  //infowindow.open(map, marker);
}

function updateMap(inputLocation, markers) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: inputLocation.geometry.location,
    zoom: 12
  });
    for (var i = 0; i < markers.length && i < 10; i++) {
      createMarker(markers[i]);
    }

    var inputLocMarker = new google.maps.Marker({
      map: map,
      position: inputLocation.geometry.location
  });

  var inputLocInfowindow = new google.maps.InfoWindow({
      content: "You are here",
      maxWidth: 160
     });
  inputLocInfowindow.open(map, inputLocMarker);
}
