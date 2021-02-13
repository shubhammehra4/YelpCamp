mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/outdoors-v11", // style URL
    center: coordinates.split(","), // starting position [lng, lat]
    zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(coordinates.split(","))
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${title}</h3><p>${mapLocation}</p>`
        )
    )
    .addTo(map);
