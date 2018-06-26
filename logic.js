var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


d3.json(queryUrl, function(data) {
  // console.log(data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>Magnitude:" + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        var markerColor = getColor(feature.properties.mag)
        
        var markerOptions = {
          radius: 7*feature.properties.mag,
          fillColor: markerColor,
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };
        return L.circleMarker(latlng, markerOptions);
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function getColor(magnitude) {
    return magnitude > 6  ? '#800000' :
           magnitude > 5  ? '#b30000' :
           magnitude > 4  ? '#e60000' :
           magnitude > 3  ? '#ff1a1a' :
           magnitude > 2  ? '#ff3333' :
           magnitude > 1  ? '#ff4d4d' :
                    '#ff8080';
};

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidGNicmVra2UiLCJhIjoiY2ppZHZtMjNwMDN2NDNxb2R4dnQwZzFwcyJ9.CC__JVUy1aQfCvW3zrUOdA");

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidGNicmVra2UiLCJhIjoiY2ppZHZtMjNwMDN2NDNxb2R4dnQwZzFwcyJ9.CC__JVUy1aQfCvW3zrUOdA");

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidGNicmVra2UiLCJhIjoiY2ppZHZtMjNwMDN2NDNxb2R4dnQwZzFwcyJ9.CC__JVUy1aQfCvW3zrUOdA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Outdoors": outdoors,
    "Satellite": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend'),
    magnitudes = [">1", "1-2", "2-3", "3-4", "4-5", "5-6", "6+"],
    labels = []

    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

  legend.addTo(myMap);
};


// earthquakes.forEach((earthquake) => {
//   L.circle(earthquake.location, {
//     fillOpacity: 0.25,
//     color: "white",
//     fillColor: "purple",
//     // Setting our circle's radius equal to the output of our markerSize function
//     // This will make our marker's size proportionate to its population
//     radius: markerSize(earthquake.population)
//   }).bindPopup("<h1>" + earthquake.name + "</h1> <hr> <h3>Population: " + earthquake.population + "</h3>").addTo(myMap);
// });