const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

const myMap = L.map("map").setView([39.8283, -98.5795], 5);

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

let magnitude;

function getColor(d) {
    return d > 5 ? '#F06C6C':
        d > 4 ? '#FF9966':
        d > 3 ? '#F3BA4D':
        d > 2 ? '#F3DB4D':
        d > 1 ? '#E1F34D':
        d > 0 ? '#B7F34D':
                '#B7F34D';
}
d3.json(url, response => {
    const earthquakes = response.features;
    earthquakes.forEach(earthquake => {
        let latitude = earthquake.geometry.coordinates[1];
        let longitude = earthquake.geometry.coordinates[0];
        let location = [latitude, longitude];
        magnitude = earthquake.properties.mag;
        let place = earthquake.properties.place;

        L.circle(location, {
            color: getColor(magnitude),
            fillColor: getColor(magnitude),
            fillOpacity: 0.75,
            radius: magnitude *35000
    }).bindPopup(`<h2>${place}</h2><hr></hr><h2>magnitude: ${magnitude}</h2>`).addTo(myMap);
    });
});

const legend = L.control({position: 'bottomright'});

legend.onAdd = (map) => {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');  
    }
    return div;
};

legend.addTo(myMap);