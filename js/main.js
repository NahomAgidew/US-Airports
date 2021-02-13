
var mymap = L.map('map', {
  center: [41.8500, -87.6500],
  zoom: 5,
  maxZoom: 10,
  minZoom: 3,
  detectRetina: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

var airports = null;

var colors = chroma.scale('Accent').mode('lch').colors(2);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

airports = L.geoJson.ajax("assets/airports.geojson",{
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.AIRPT_NAME);
    return feature.properties.CNTL_TWR;
  },
  pointToLayer: function (feature, latlng) {
    var id = 0;
    if (feature.properties.CNTL_TWR === "Y") {
      id = 0;
      return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-flag marker-color-' + (id + 1).toString() })});
    } else if (feature.properties.CNTL_TWR === "N") {
      id = 1;
      return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-flag marker-color-' + (id + 1).toString() })});
    }
  },
  attribution: 'Airports Data &copy; | https://catalog.data.gov/dataset/usgs-small-scale-dataset-airports-of-the-united-states-201207-shapefile| &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Made By Nahom Abi'
}).addTo(mymap);


colors = chroma.scale('YlOrRd').colors(5);

function setColor(density) {
  var id = 0;
  if (density > 100) { id = 4; }
  else if (density > 50 && density <= 100) { id = 3; }
  else if (density > 20 && density <= 50) { id = 2; }
  else if (density > 5 &&  density <= 20) { id = 1; }
  else  { id = 0; }
  return colors[id];
}

function style(feature) {
  return {
      fillColor: setColor(feature.properties.count),
      fillOpacity: 0.4,
      weight: 2,
      opacity: 1,
      color: '#b4b4b4',
      dashArray: '4'
  };
}

var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
  style: style,
  attribution: 'U.S. States Data &copy; Mike Bostock | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Made By Nahom Abi'
}).addTo(mymap);

var legend = L.control({position: 'topright'});

legend.onAdd = function () {
  // Create Div Element and Populate it with HTML
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<b># of Airports</b><br />';
  div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 101+ </p>';
  div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 51-100 </p>';
  div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 21-50 </p>';
  div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 6-20 </p>';
  div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-5 </p>';
  div.innerHTML += '<hr><b>Has Air Traffic Control Tower<b><br />';
  div.innerHTML += '<i class="fa fa-flag marker-color-1"></i><p> Yes </p>';
  div.innerHTML += '<i class="fa fa-flag marker-color-2"></i><p> No </p>';
  // Return the Legend div containing the HTML content
  return div;
};

legend.addTo(mymap);

L.control.scale({position: 'bottomleft'}).addTo(mymap);
