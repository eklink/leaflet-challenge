// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + "Magnitude  " + feature.properties.mag +
      "</h3><hr><p>" + "Earthquake Location:  " + feature.properties.place + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  
  var earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: colorRange(feature.properties.mag),
        color: "pink",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 0.8
      });
    },

    // Run the onEachFeature function once for each piece of data in the array
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Define function to create a map
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
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
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Create the legend
var legend = L.control({
  position: "bottomright"
});


legend.onAdd = function(myMap) {
  var legend_loc = L.DomUtil.create("div", "info legend"),
  levels = [0, 1, 2, 3, 4, 5]

  // Loop through magnitude intervals and generate a label with a colored square for each interval
  for (var i = 0; i < levels.length; i++) {
    legend_loc.innerHTML += '<i style="background:' + colorRange(levels[i]) + '"></i> ' + [i] + (levels[i + 1] ? '&ndash;' + 
      levels[i + 1] + '<br>' : '+');
  }
  return legend_loc;
};

// Add legend to the map
legend.addTo(myMap);
}

// Define colors depending on the magnituge of the earthquake
function colorRange(magnituge) {

switch (true) {
  case magnituge >= 5.0:
    return 'darkpurple';
    break;

  case magnituge >= 4.0:
    return 'darkblue';
    break;
  
  case magnituge >= 3.0:
    return 'purple';
    break;

  case magnituge >= 2.0:
    return 'blue';
    break;

  case magnituge >= 1.0:
    return 'lightpurple';
    break;

  default:
    return 'lightblue';
};
};



// Reflect the earthquake magnitude
function markerSize(magnituge) {
  return magnituge*6;
};

