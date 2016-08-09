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

var infowindow = new google.maps.InfoWindow();

  var usaStyle = {
    strokeWeight: 0,
    fillColor: '#555',
    fillOpacity: '0.4'
    };

 var pdrFarm = {
    strokeColor: '#16a085',
    strokeWeight: 2,
    fillColor: '#16a085',
    fillOpacity: '0.5'
    };

  var donated = {
    strokeColor: '#2980b9',
    strokeWeight: 2,
    fillColor: '#2980b9',
    fillOpacity: '0.5'
    };

    var underContract = {
    strokeColor: '#2c3e50',
    strokeWeight: 2,
    fillColor: '#2c3e50',
    fillOpacity: '0.5'
    };

  var pdr = new google.maps.Data()
  var usa = new google.maps.Data()

  pdr.loadGeoJson('data/pdr.geojson')
  usa.loadGeoJson('data/usa.geojson')
  
  pdr.setStyle(function(feature){
  var s = status(feature.getProperty('STATUS'),feature.getProperty('FUNDING'))  
  if (s === 'PDR Protect Farm - Donated'){ return donated}
  else if (s === 'Under Contract with PDR Program') {return underContract}
  else {return pdrFarm}   
  }
  );

  usa.setStyle(usaStyle);

  pdr.setMap(map)
  usa.setMap(map)
  

 pdr.addListener('click', function(event) {


    infowindow.setContent(
    '<h5>' + event.feature.getProperty('ADDRESS')  + '</h5>'+
    '<p class="item"><strong>Application No: </strong>' + event.feature.getProperty('APPNUM') + '</p>' +
    '<p class="item"><strong>Acreage: </strong>' + event.feature.getProperty('PDR_ACRE') + '</p>' +
    '<p class="item"><strong>Status: </strong>' + status(event.feature.getProperty('STATUS'),event.feature.getProperty('FUNDING')) + '</p>' +
    '<a href="http://qpublic9.qpublic.net/ky_fayette_display.php?county=ky_fayette&KEY=' + event.feature.getProperty('PVANUM') + '"> Visit PVA Page</a>'
    )
    var anchor = new google.maps.MVCObject();
        anchor.setValues({ //position of the point
            position: event.latLng,
            anchorPoint: new google.maps.Point(0, 0)
        });

        infowindow.open(map, anchor);
  });
   

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


function status(status, funding){
  var r
  if (status === 'AO') {
    r = 'Under Contract with PDR Program'
  }
  else if (status === 'PF' && funding === 'D'){
    r = 'PDR Protect Farm - Donated'
  }
  else {
    r = 'PDR Protected Farm'
  }
  return r
}