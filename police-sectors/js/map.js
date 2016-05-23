function initialize(){

  var markers = [];
  
  var mapOptions = {
    overviewMapControl:true,
    rotateControl:true,
    scaleControl:true,
    mapTypeControl: true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, position:google.maps.ControlPosition.TOP_CENTER},
    zoomControl: true,
    zoomControlOptions: {style: google.maps.ZoomControlStyle.DEFAULT}
    };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


  map.data.setStyle(function(feature) {
    var sector = feature.getProperty('Sector');
    if (sector == 'West') {var color = 'darkblue'}
    else if (sector == 'Central') {var color = 'green'}
    else if (sector == 'East') {var color = 'red'}
    else {var opac = 0}
    return {
    strokeColor: color,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: .2 
    };
});

  map.data.addListener('click', function(event) {
  map.data.revertStyle();	
  map.data.overrideStyle(event.feature, {fillOpacity: .6, zIndex: 3});
  });
 
  var infowindow = new google.maps.InfoWindow();

  map.data.addListener('click', function(event) {
      infowindow.setContent(
      '<h4>' + event.feature.getProperty('Sector') + ' Sector</h4>' +
      '<p>' + event.feature.getProperty('Phone') + '</p>' +
      '<p class="sector-data">' + event.feature.getProperty('RCAddress') + '</p>' +
      '<p class="sector-data">' + event.feature.getProperty('City') + ', ' + event.feature.getProperty('State') + ' ' + event.feature.getProperty('Zip') + '</p>'
        );
      infowindow.setPosition(event.latLng)
      infowindow.open(map);

  })

  map.data.loadGeoJson('data/sectors.geojson')

  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.921971, -84.663139),
      new google.maps.LatLng(38.155595, -84.334923)
      );
  
  map.fitBounds(defaultBounds);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });


      markers.push(marker);

      bounds.extend(place.geometry.location);
      infowindow.close(map);
    }
    
    map.fitBounds(bounds);
    map.setZoom(14)
      });
  // [END region_getplaces]



  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);