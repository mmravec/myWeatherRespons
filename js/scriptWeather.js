/**
 * Created by martinmravec on 12.11.16.
 */

var jsonData;

$.ajaxSetup({
    async: false
});


function foundJson(url) {

    if (url == null) {
        var getIP = 'http://ip-api.com/json/';
        var openWeatherMap = 'http://api.openweathermap.org/data/2.5/forecast/weather?'
        $.getJSON(getIP).done(function (location) {
            xxx = location;
            $.getJSON(openWeatherMap, {
                lat: location.lat,
                lon: location.lon,
                APPID: 'e4d26d20b0bd7b335bbf970717993ecd'
            }).done(function (weather) {
                jsonData = weather;
            })
        })
    } else {
        var appiUrl = url;
        $.getJSON(appiUrl, function (data) {
            jsonData = data;
        });
    }
    return jsonData;
}

function searchYourCity() {

    if (document.getElementById("myText").value) {
        var x = document.getElementById("myText").value;

        var appiUrl = "http://api.openweathermap.org/data/2.5/forecast/weather?q="
        var appiKey = "&APPID=e4d26d20b0bd7b335bbf970717993ecd"

        var res = appiUrl.concat(x, appiKey);
        //document.getElementById("demo").innerHTML = jsonData.city.name;
        foundJson(res);
        getName();
        //updateTabel();
        drawChart();
        createLine();
        updateTabel();
        for (i = 1; i < 8; i++) {
            changeImg(i);
            getBoxInfo1(i);
        }

    }

}

function getName() {
    if (jsonData) {
        //alert("Succes " + jsonData.count);

        helpValue = null;
        helpValue = jsonData.city.name;
        document.getElementById("nameOfCity").innerHTML = helpValue;

    } else {
        alert("something is wrong");
    }
}

function getBoxInfo1(i) {
    var j = 1;


    // if((!("3h" in jsonData)==0))
    // {
    //     document.getElementById("rain"+j).innerHTML = " Rain: 0" ;
    //
    // }else {
    //     if(typeof jsonData.list[i].rain["3h"] == "undefined")
    //     {
    //         document.getElementById("rain"+j).innerHTML = "Rain: " +jsonData.list[i].rain["3h"];
    //     }else
    //     {
    //         document.getElementById("rain"+j).innerHTML = "Snow: " +jsonData.list[i].rain["3h"];
    //     }
    var helpTemp = (jsonData.list[i].main.temp - 273.15).toFixed(2);
    document.getElementById("temp" + i).innerHTML = "" + helpTemp + " C";
    document.getElementById("desc" + i).innerHTML = "" + jsonData.list[i].weather[0].description;
    document.getElementById("humi" + i).innerHTML = "" + jsonData.list[i].main.humidity + " %";
    document.getElementById("wind" + i).innerHTML = "" + jsonData.list[i].wind.speed + " m/s";
    document.getElementById("date" + i).innerHTML = "" + jsonData.list[i].dt_txt.split(" ", 1)[0];
    //}
    j++;
}

function changeImg(i) {

    if (jsonData.list[i].weather[0].description == "clear sky") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/01d.png";
    }
    else if (jsonData.list[i].weather[0].description == "broken clouds") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/02d.png";
    } else if (jsonData.list[i].weather[0].description == "light rain") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/10d.png";
    } else if (jsonData.list[i].weather[0].description == "scattered clouds") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/03d.png";
    } else if (jsonData.list[i].weather[0].description == "few clouds") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/02d.png";
    } else if (jsonData.list[i].weather[0].description == "light snow") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/09d.png";
    } else if (jsonData.list[i].weather[0].description == "shower rain") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/13d.png";
    } else if (jsonData.list[i].weather[0].description == "rain") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/10d.png";
    } else if (jsonData.list[i].weather[0].description == "thunderstorm") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/11d.png";
    } else if (jsonData.list[i].weather[0].description == "mist") {
        var img = document.getElementById("imageid" + i);
        img.src = "img/50d.png";
    }
}

google.charts.load('current', {'packages': ['bar', 'corechart', 'line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();

    // Add columns
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Temperature [C]');
    data.addColumn('number', 'Presure [kPa]');
    data.addColumn('number', 'Wind [m/s]');

    // Add empty rows
    data.addRows(8);

    //fill up rows
    for (i = 0; i < 8; i++) {
        data.setCell(i, 0, (jsonData.list[i].dt_txt).toString());
        data.setCell(i, 1, (jsonData.list[i].main.temp - 273.15).toFixed(2));
        data.setCell(i, 2, ((jsonData.list[i].main.pressure) / 1000).toFixed(2));
        data.setCell(i, 3, (jsonData.list[i].wind.speed));
    }

    var options = {
        chart: {
            //title: 'Weather next 12 hours',
            //subtitle: 'Temperature, Presure, and Wind: next 12 hours',
        }
    };

    var chart = new google.charts.Bar(document.getElementById('columnchart_material'));
    chart.draw(data, options);
}

function createLine() {
    var arrayTempMax = [];
    var arrayTempMin = [];
    var arrayTempAvg = [];
    var arrayDate = [];

    for (i = 0; i < 15; i++) {
        arrayTempMax.push(jsonData.list[i].main.temp_max - 273.15);
        arrayTempMin.push(jsonData.list[i].main.temp_min - 273.15);
        arrayTempAvg.push(jsonData.list[i].main.temp - 273.15);
        arrayDate.push(jsonData.list[i].dt_txt);
    }

    var trace1 = {
        y: [],
        x: [],
        type: 'scatter'
    };
    trace1['y'] = arrayTempMax;
    trace1['x'] = arrayDate;


    var trace2 = {
        y: [],
        x: [],
        type: 'scatter'
    };

    trace2['y'] = arrayTempMin;
    trace2['x'] = arrayDate;

    var trace3 = {
        y: [],
        x: [],
        type: 'scatter'
    };
    trace3['y'] = arrayTempAvg;
    trace3['x'] = arrayDate;


    var data = [trace1, trace2, trace3];

    Plotly.newPlot('myDiv', data);
}


function updateTabel() {
    $('#example').dataTable().fnClearTable();
    $('#example').dataTable().fnAddData(getDate());
}


function getDate() {

    var data = [];
    for (i = 0; i < jsonData.list.length; i++) {
        var arrayHelp = {};
        arrayHelp.Temperature = (jsonData.list[i].main.temp - 273.15).toFixed(2);
        arrayHelp.Humidity = jsonData.list[i].main.humidity;
        arrayHelp.Wind = jsonData.list[i].wind.speed;
        arrayHelp.Description = jsonData.list[i].weather[0].description;
        arrayHelp.Pressure = ((jsonData.list[i].main.pressure) / 1000).toFixed(2);
        arrayHelp.Temp_max = (jsonData.list[i].main.temp_max - 273.15).toFixed(2);
        arrayHelp.Dt_txt = jsonData.list[i].dt_txt;
        data.push(arrayHelp)
    }

    return data;
}


/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Presure</td>' +
        '<td>' + d.Pressure + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Max Temperatue</td>' +
        '<td>' + d.Temp_max + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Date</td>' +
        '<td>' + d.Dt_txt + '</td>' +
        '</tr>' +
        '</table>';
}

