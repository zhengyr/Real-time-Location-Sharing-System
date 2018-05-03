'use strict';

var heat = {};

let occupiedCoord = [];

heat.init = function() {
    $.get("/getHeatData", function(result) {
        occupiedCoord = result;
        initMap();
    });
}

$(document).ready(function() {
    heat.init();
});

function initMap() {
    console.log(document.getElementById('map'))
      let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 42.4451543, lng: -76.4852264}
      });

      let heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
      });
    }

    function toggleHeatmap() {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }

    function changeGradient() {
      var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
      heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    }

    function changeRadius() {
      heatmap.set('radius', heatmap.get('radius') ? null : 20);
    }

    function changeOpacity() {
      heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
    }

    // Heatmap data: 500 Points
    function getPoints() {
        let latlngList = [];
        occupiedCoord.forEach(coor => {
            latlngList.push(new google.maps.LatLng(
                coor.longitude, coor.latitude));
        });
        return latlngList;
    }