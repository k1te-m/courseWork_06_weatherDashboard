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
    var cardEl = $("<div>").addClass("card").attr("style", "width: 100%");
    cardEl.attr("id", "currentday-weather");
    var cardBodyEl = $("<div>").addClass("card-body");
    var currentDateEl = $("<div>").text(moment().format("MMMM Do YYYY"));
    currentDateEl.addClass("card-title text-muted");
    var cityNameEl = $("<div>").text(response.name);
    cityNameEl.addClass("card-subtitle mb-2");
    var weatherIcon = response.weather[0].icon;
    var weatherIconURL = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
    var weatherIconEl = $("<img>").attr("src", weatherIconURL);
    var currentTemp = $("<div>").text("Temperature: " + Math.floor((response.main.temp - 273.15) * 1.80 + 32) + "°");
    currentTemp.addClass("card-text");
    var currentHumEl = $("<div>").text("Humidity: " + response.main.humidity + "%");
    currentHumEl.addClass("card-text");
    var currentWindSEl = $("<div>").text("Wind Speed: " + Math.floor((response.wind.speed * 2.23694)) + "mph");
    currentWindSEl.addClass("card-text");

    var currentWeatherCard = cardEl.append(cardBodyEl.prepend(currentDateEl, cityNameEl.append(weatherIconEl), currentTemp, currentHumEl, currentWindSEl));


    //rendering of current forecast card
    $("#weather").append(currentWeatherCard);
    

    //variables for UV Index ajax call
    var cityLon = response.coord.lon;
    var cityLat = response.coord.lat;
    var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey;

    $.ajax({
        url:queryURL2,
        method: "GET"
    }).then(function(response2) {
        console.log(response2);
        var uvIndexEl = $("<div>").text("UV Index: " + response2.value);
        uvIndexEl.addClass("card-text");
        currentWindSEl.append(uvIndexEl);
    })

    //variables for 5 day weather ajax call
    var queryURL3 = "https://api.openweathermap.org/data/2.5/onecall?lat="+ cityLat + "&lon=" + cityLon + "&exclude=current,minutely,hourly,alerts&appid=" + APIKey;

    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function(response3){
        console.log(response3);
    })
     
    
   
    

    

    

    
    
    
    
})

}




$("#submit-button").on("click", function(event) {
    event.preventDefault();
    $("#current-forecast").attr("style", "display: block;");
    $("#five-day").attr("style", "display: inline-block;");
    console.log("working");
    
    getWeather();
    
});

