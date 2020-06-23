// jshint esversion: 6

const lat = 51.96;
const lon = 7.59;
const start_latlng = [lat, lon];
const regex = /\s*{\s*"type"\s*:\s*"FeatureCollection"\s*,\s*"features"\s*:\s*\[\s*{\s*"type"\s*:\s*"Feature"\s*,\s*"properties"\s*:\s*{(\s*"[a-zA-z\d]"*\s*:\s*"[a-zA-z\d]"\s*,\s*)*(\s*"[a-zA-z\d]"*\s*:\s*"[a-zA-z\d]"\s*)?}\s*,\s*"geometry"\s*:\s*\{"type"\s*:\s*"Point"\s*,\s*"coordinates"\s*:\s*\[-?\d{1,2}(\.\d*)?\s*,\s*-?\d{1,3}(\.\d*)?\s*\]\s*\}\s*\}\s*\]\s*\}\s*/gi;




var map = L.map("map").setView(start_latlng, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 14,
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
    id: "osm"
}).addTo(map);


var drawnItems = L.featureGroup().addTo(map);

//Only the marker drawer is allowed
map.addControl( new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        circle: false,
        marker: true,
        polyline: false,
        rectangle:false,
        circlemarker: false,
        point: false,
         polygon: false,
    }
}));

//If the draw is deleted the textarea will also be cleared
map.on("draw:deleted", function (event) {
    "use strict";
    deleteText();
});

//if there will be a new Polygon drawn, the old one will be deleted and the text area updated
map.on("draw:created", function (event) {
    "use strict";
    var layer = event.layer;
    drawnItems.clearLayers();
    drawnItems.addLayer(layer);

    deleteText();
    updateText();
});

//if the draw will be edited the textarea changes
map.on("draw:edited", function (event) {
    "use strict";
    deleteText();
    updateText();
});

/**
 * clears the Text area
 */
function deleteText(){
    "use strict";
    document.getElementById("geojsontextarea").value = "";
}
/**
 * creates a geojson text representation from the the drawnItems with a FeatureCollection as root element
 */
function updateText(){
    "use strict";
    document.getElementById("geojsontextarea").value = JSON.stringify(drawnItems.toGeoJSON());
}

function dispayGeoJSON(geoJson){
    console.log(geoJson)
    drawnItems.clearLayers();
    for(var elem of geoJson){
     console.log(elem)
     const marker= L.marker([elem.features[0].geometry.coordinates[1],elem.features[0].geometry.coordinates[0]]);
     marker.addTo(drawnItems)
 }
    // marker.addTo(map)
     map.fitBounds(drawnItems.getBounds());
}

/**
* @desc is called when a the user presses the seach-address button.
* makes a call to the here-api using geocoder.geocode(), and inserts the first
* result into the user-position input field.
*/
function searchAddress(){
    let userInput = $("#addressSearch").val() + ", Münster";
    let position = geocoder.geocode(userInput);
  
    //insert the new value into the userPosition textarea, using jquery instead of
    // document.getElementById
    $("#userPosition").val(position);
  }

/**
 * 
 */
function onChange(){
    "use strict";
    let value= document.getElementById("geojsontextarea").value;
    console.log(value)
    try{
        const json = JSON.parse(value);
        //regex of regular geojson

           dispayGeoJSON([json])
    }
    catch(e){
        console.log(e)
        alert("No valid GeoJSON inserted");
        }
}

  /**
   * showPosition
   * @public
   * @desc Shows the position of the user in the textarea.
   * callback function that is passed by getLocation
   * @see getLocation
   * @param {*} position Json object of the user
   */
  function showPosition(position) {
    var x = document.getElementById("geojsontextarea");
    //"Skeleton" of a valid geoJSON Feature collection
    let outJSON = { "type": "FeatureCollection", "features": [] };
    //skelly of a (point)feature
    let pointFeature = {"type": "Feature","properties": {},"geometry": {"type": "Point","coordinates": []}};
    pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];


    //add the coordinates to the geoJson
    outJSON.features.push(pointFeature);
    dispayGeoJSON([outJSON])
    x.value = JSON.stringify(outJSON);
  }

  /**
   * getLocation
   * @public
   * @desc function that requests the geographic position of the browser
   * @see getPosition
   */
  function getLocation() {
    var x = document.getElementById("userPosition");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

function save(){
    let value= document.getElementById("geojsontextarea").value;
    try{
        const json = JSON.parse(value);
    if (regex.test(value)) {
       
        $.ajax({
            url: "/mongo", // URL der Abfrage,
            data: json,
            type: "post"
        })
            .done(function (response) {
                console.log(response)
            })
            .fail(function (xhr, status, errorThrown) {
                alert("something went wrong")
            })

    } else {
        alert("No valid GeoJSON inserted");
    }
}
    catch(e){
        console.log(e)
        alert("No valid GeoJSON inserted");
        }
}

function getData(){
    $.ajax({
        url: "/mongo", // URL der Abfrage,
        //data: json,
        type: "get"
    })
        .done(function (response) {
            document.getElementById("geojsontextarea").value = JSON.stringify(response);
            dispayGeoJSON(response);
        })
        .fail(function (xhr, status, errorThrown) {
            alert("something went wrong")
        })
}

function deleteAll(){
    $.ajax({
        url: "/mongo/all", // URL der Abfrage,
        //data: json,
        type: "delete"
    })
        .done(function (response) {
            console.log(response)
        })
        .fail(function (xhr, status, errorThrown) {
            alert("something went wrong")
        })
}

function deleteOne(){

    let id= document.getElementById("id").value;
    $.ajax({
        url: "/mongo", // URL der Abfrage,
        data: {_id : id},
        type: "delete"
    })
        .done(function (response) {
            console.log(response)
        })
        .fail(function (xhr, status, errorThrown) {
            alert("something went wrong")
        })
}

function update(){

    let id= document.getElementById("id").value;

    let value= document.getElementById("geojsontextarea").value;
    try{
        const json = JSON.parse(value);
    if (regex.test(value)) {

    $.ajax({
        url: "/mongo", // URL der Abfrage,
        data: {_id : id, object : json},
        type: "put"
    })
        .done(function (response) {
            console.log(response)
        })
        .fail(function (xhr, status, errorThrown) {
            alert("something went wrong")
        })
    } 
    else {
        alert("No valid GeoJSON inserted");
    }
}
    catch(e){
        console.log(e)
        alert("No valid GeoJSON inserted");
        }
}


/** Class for communicating with the here-geocoding-API
* uses JQuery-ajax to better handle jsonp
*/
class HereAPI {
    constructor(){
      this.API_URL = "https://geocode.search.hereapi.com/v1/geocode";
      //this.APP_ID = HERE_APP_ID;
      this.API_KEY = HERE_API_KEY;
  
    }
  
    /**
     * geocode
     * @public
     * @desc method to allow calls to the here-geocoding api.
     * This method uses JQuery ajax in order to make a jsonp request to circumvent
     * the lack of an "acces-control-allow-origin:*" header in the response of the
     * here-API.
     */
    geocode(query){
      $.ajax({
        url: this.API_URL,
        dataType: "jsonp",
  
        data :{
          q: query,
          apiKey: HERE_API_KEY
        },
  
        success : this.geocodeCallback
      });
    }
  
    /**
     * geocodeCallback
     * @public
     * @desc this method is called when the geocoding request is done.
     * It determines what is to be done with the data.
     */
     geocodeCallback(response){
         console.log(response)
      let coords = [[response.items[0].position.lng, response.items[0].position.lat]];
      coords = geoJSON.arrayToGeoJSON(coords);
      dispayGeoJSON([coords])
      coords = JSON.stringify(coords);
      $("#geojsontextarea").val(coords);

    }
  }

  const geocoder = new HereAPI();