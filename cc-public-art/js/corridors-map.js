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

  var corridors = new google.maps.Data()
  var sites = new google.maps.Data()
  var trafficBoxes = new google.maps.Data()

  var infowindow = new google.maps.InfoWindow();

  corridors.loadGeoJson('data/corridors.geojson');
  sites.loadGeoJson('data/sites.geojson');
  trafficBoxes.loadGeoJson('data/signalBoxes.geojson');

  corridors.addListener('click', function(event) {
        var content = 
        '<strong>Name: </strong>' + event.feature.getProperty("ANNO") + 
        '<br/><strong>Maintenance: </strong>' + event.feature.getProperty("MAINTENANC")
        infowindow.setContent(content);
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infowindow.open(map,anchor);
      });

  sites.addListener('click', function(event) {
        var content = '<strong>Address: </strong>' + event.feature.getProperty("LOC_ADRNO") + ' ' + event.feature.getProperty("LOC_ADRSTR") + ' ' + event.feature.getProperty("LOC_ADRSUF") +
        '<br/><strong>Owner: </strong>' + event.feature.getProperty("OWN1")
        infowindow.setContent(content);
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infowindow.open(map,anchor);
  });

  trafficBoxes.addListener('click', function(event) {
        var content = '<strong>Intersection: </strong>' + event.feature.getProperty("INTERSECTI")
        infowindow.setContent(content);
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infowindow.open(map,anchor);
  });


 var green = {icon: {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#27ae60',
    fillOpacity: 1,
    scale: 5,
    strokeColor: '#333',
    strokeWeight: 3
    }};

  var blue = {
    strokeColor: '#2980b9',
    strokeWeight: 4,
    fillColor: '#2980b9',
    fillOpacity: '0.5'
    };

   var red = {
    strokeColor: '#e74c3c',
    strokeWeight: 2,
    fillColor: '#e74c3c',
    fillOpacity: '0.5'
    };

  corridors.setStyle(blue);
  sites.setStyle(red)
  trafficBoxes.setStyle(green)
  
  sites.setMap(map)
  corridors.setMap(map)
  trafficBoxes.setMap(map)


  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(38.00536101289634, -84.54357147216797),
      new google.maps.LatLng(38.0694467480777, -84.45568084716797)
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
    }
    
    map.fitBounds(bounds);
    map.setZoom(15)
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