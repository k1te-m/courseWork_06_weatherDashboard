//function to retrieve current weather forecast
function getWeather(userCity) {

var userCity = $("#user-city").val();
var APIKey = "96f3dfbfcb0c17c6b7abf0c008b21dd6";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+userCity+"&appid="+APIKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response);

    //variables for current forecast ajax call
    var currentDateEl = moment().format("MMMM Do YYYY");
    var cityNameEl = response.name;
    var weatherIcon = response.weather[0].icon;
    var weatherIconURL = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
    var weatherIconEl = $("<img>").attr("src", weatherIconURL);
    var currentTemp = Math.floor((response.main.temp - 273.15) * 1.80 + 32);
    var currentHum = response.main.humidity;
    var currentWindS = Math.floor((response.wind.speed * 2.23694));

    //rendering of current forecast card
    $("#city-display").text(cityNameEl);
    $("#city-display").append(weatherIconEl);
    $("#date-display").text(currentDateEl);
    $("#temp-display").text("Temperature: " + currentTemp + "°");
    $("#humid-display").text("Humidity: " + currentHum + "%");
    $("#wind-speed-display").text("Wind Speed: " + currentWindS + " mph");

    //variables for UV Index ajax call
    var cityLon = response.coord.lon;
    var cityLat = response.coord.lat;
    var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLat + "&appid=" + APIKey;

    $.ajax({
        url:queryURL2,
        method: "GET"
    }).then(function(response2) {
        console.log(response2);
        var uvIndex = response2.value;
        $("#uv-display").text("UV Index: " + uvIndex)
    })
    
   
    

    

    

    
    
    
    
})

}



$("#submit-button").on("click", function(event) {
    $("#current-forecast").attr("style", "display: block;")
    event.preventDefault();
    console.log("working");
    
    getWeather();
});

