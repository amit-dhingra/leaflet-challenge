var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url, function(data) {
    createFeatures(data.features);
});

function getRadius(magnitude){
  return 4*magnitude;  
}

function getColor(magnitude) {

  if (magnitude > 5) {
    return '#FF3933'
  } 
  else if (magnitude > 4) {
    return '#FF8933'
  }
  else if (magnitude > 3) {
    return '#FFAE33'
  }
  else if (magnitude > 2) {
  return '#FFCD33'
  }
   else if (magnitude > 1) {
    return '#F6FF33'
  }
  else {
    return '#78FF33'
  }
};



function onEachFeature(feature, layer) {
    layer.bindPopup("<h3 align='center'>" + feature.properties.place +
        "</h3><hr><p><u>Occurrence:</u> " + new Date(feature.properties.time) + "</p>" +
        "</h3><p><u>Magnitude:</u> " + feature.properties.mag + "</p>");
}

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature,
          pointToLayer: function (feature, latlng) {
          var geojsonMarkerOptions = {
          radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
      }
  });
    
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
  });
 
 var map = L.map("map", {
      center: [36.17, -115.13],
      zoom: 5,
      layers: [lightmap,earthquakes]
  });

  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {    
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4,5],
    labels = [];

    div.innerHTML+=''

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '-' + grades[i + 1] + '<br>' : '+');
  }
    
    return div;
  };
    
  legend.addTo(map);
}