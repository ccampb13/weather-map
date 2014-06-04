/* global google:true, AmCharts:true */
/* jshint unused:false, camelcase:false */

(function(){
  'use strict';

  $(document).ready(init);


  let map;
  let charts = {};

  function init(){
    initMap(51.4606, 0.3582, 10);
    $('#add').click(add);
  }

  function add(){
    let zip = $('#zip').val().trim();
    getWeather(zip);
    searchMap(zip);
  }

  function searchMap(zip){
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: location},(results, status)=>{  // ()=> creates an anonymous function with results and status being the paramaters
      let name = results[0].formatted_address;
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
    });
  }

  function addMarker(lat, lng, name, icon){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title:name, icon: icon}); //icon adds the flag
  }


  function initMap(lat, lng, zoom){
    let styles = [{'stylers':[{'hue':'#dd0d0d'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};  //{is used when adding multiple statements}
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function getWeather(zip){
    let url = `http://api.wunderground.com/api/ec7d37e6e89e3180/forecast10day/q/${zip}.json?callback=?`;
    $.getJSON(url, data=>{
       $('#graphs').append(`<div class=graph data-zip=${zip}></div>`);
       initGraph(zip);
       data.forecast.simpleforecast.forecastday.forEach(f=>charts[zip].dataProvider.push({day: f.date.weekday, low: f.low.fahrenheit, high: f.high.fahrenheit}));
       charts[zip].validateData();
    });
  }
   function initGraph(zip){
    let graph = $(`.graph[data-zip=${zip}]`)[0];
    console.log(graph);
    charts[zip] = AmCharts.makeChart(graph, {
    'type': 'serial',
    'theme': 'none',
    'pathToImages': 'http://www.amcharts.com/lib/3/images/',
    'titles': [{
        'text': zip,
        'size': 15
    }],
    'dataProvider': [],
    'valueAxes': [{
        'id':'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#dd0d0d',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
    }],
    'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Low Temperature',
        'valueField': 'low',
        'fillAlphas': 0
    }, {
        'valueAxis': 'v1',
        'lineColor': '#000000',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'High Temperature',
        'valueField': 'high',
        'fillAlphas': 0
      }],
      'chartCursor': {
          'cursorPosition': 'mouse'
      },
      'categoryField': 'day',
      'categoryAxis': {
          'axisColor': '#DADADA',
          'minorGridEnabled': true,
          'labelRotation': 45
      }
      });
  }


})();
