//function to retrieve current weather forecast
// var userCity = $("#user-city").val();
var APIKey = "96f3dfbfcb0c17c6b7abf0c008b21dd6";
let cityHistory = JSON.parse(localStorage.getItem("fetch")) || [];
console.log(cityHistory);

function getWeather(userCity) {
  
  var queryURLWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity +
    "&appid=" +
    APIKey;

  $.ajax({
    url: queryURLWeather,
    method: "GET",
  }).then(function (responseW) {
    console.log(responseW);

    //variables for current forecast ajax call to build card
    var cardEl = $("<div>").addClass("card").attr("style", "width: 35%");
    cardEl.attr("id", "currentday-weather");
    var cardBodyEl = $("<div>").addClass("card-body");
    var currentDateEl = $("<div>").text(moment().format("MMMM Do YYYY"));
    currentDateEl.addClass("card-title text-muted");
    var cityNameEl = $("<div>").text(responseW.name);
    cityNameEl.addClass("card-subtitle mb-2");
    var weatherIcon = responseW.weather[0].icon;
    var weatherIconURL =
      "https://openweathermap.org/img/w/" + weatherIcon + ".png";
    var weatherIconEl = $("<img>").attr("src", weatherIconURL);
    var currentTemp = $("<div>").text(
      "Temperature: " +
        Math.floor((responseW.main.temp - 273.15) * 1.8 + 32) +
        "°"
    );
    currentTemp.addClass("card-text");
    var currentHumEl = $("<div>").text(
      "Humidity: " + responseW.main.humidity + "%"
    );
    currentHumEl.addClass("card-text");
    var currentWindSEl = $("<div>").text(
      "Wind Speed: " + Math.floor(responseW.wind.speed * 2.23694) + "mph"
    );
    currentWindSEl.addClass("card-text");

    var currentWeatherCard = cardEl.append(
      cardBodyEl.prepend(
        currentDateEl,
        cityNameEl.append(weatherIconEl),
        currentTemp,
        currentHumEl,
        currentWindSEl
      )
    );

    //rendering of current forecast card
    $("#weather").append(currentWeatherCard);

    function getUVIndex(userCity) {
    //variables for UV Index ajax call
    var cityLon = responseW.coord.lon;
    var cityLat = responseW.coord.lat;
    var queryURLUV =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&appid=" +
      APIKey;

    $.ajax({
      url: queryURLUV,
      method: "GET",
    }).then(function (responseUV) {
      var UVindex = responseUV.value;
      var uvIndexEl = $("<div>").text("UV Index: " + UVindex);
      if (UVindex <= 2.99) {
        uvIndexEl.addClass("lowUV");
      } else if (UVindex >= 3.00 && UVindex <= 7.99){
        uvIndexEl.addClass("moderateUV");
      } else if (UVindex >= 8) {
        uvIndexEl.addClass("extremeUV");
      }

      uvIndexEl.addClass("card-text");
      currentWindSEl.append(uvIndexEl);
    });
        function getForecast(userCity){
            var queryURLForecast ="https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat +"&lon=" +cityLon +"&exclude=current,minutely,hourly,alerts&appid=" +APIKey;
            $.ajax({
                        url: queryURLForecast,
                        method: "GET",
                    }).then(function (responseF) {
                        console.log(responseF);
                        console.log(responseF.daily[1].dt);
                        var dateUnix = responseF.daily[1].dt;
                        var dateString = moment.unix(dateUnix).format("MM/DD/YYYY");
                        console.log(dateString);

                        for (i = 1; i <= 5; i++) {
                          var dateUnix = responseF.daily[i].dt;
                          var dateString = moment.unix(dateUnix).format("MMMM Do YYYY");
                        
                          var forecastIcon = responseF.daily[i].weather[0].icon;
                          var forecastIconURL = "https://openweathermap.org/img/w/" + forecastIcon + ".png";
                          var forecastIconEl = $("<img>").attr("src", forecastIconURL);
                          
                          var forecastTemp = Math.floor((responseF.daily[i].temp.max - 273.15) * 1.8 +32);
                      

                          var forecastHum = responseF.daily[i].humidity;
                          
                          var forecastCardEl = $("<div>").addClass("card").attr("style", "width: 100%");
                          forecastCardEl.attr("date-index", "day-" + i);
                          var forecastCardBodyEl = $("<div>").addClass("card-body forecast-card");
                          var forecastDateEl = $("<div>").text(dateString);
                          forecastDateEl.addClass("card-title text-muted");
                          var forecastTempEl = $("<div>").text("Temperature: " + forecastTemp + "°");
                          forecastTempEl.addClass("card-text");
                          var forecastHumEl = $("<div>").text("Humidity: " + forecastHum + "%")
                          forecastHumEl.addClass("card-text");

                          var colEl = $("<div>").addClass("col");

                          var forecastCard = colEl.append(forecastCardEl.append(forecastCardBodyEl.prepend(forecastDateEl, forecastTempEl.append(forecastIconEl), forecastHumEl)));

                          $("#forecast").append(forecastCard);

                        }
                    });
        }
        getForecast(userCity);
    }

    getUVIndex(userCity);
  });
  
}

function renderCityHistory() {
  $("#city-list").html("");
  for (let i = 0; i < cityHistory.length; i++) {
    var cityEl = $("<li>").addClass("list-group-item d-block bg-white");
    cityEl.text(cityHistory[i]);
    
    $("#city-list").append(cityEl);
  }
  $("li").on("click", function() {
    console.log($(this).text());
    getWeather($(this).text());
  })
}

// function getForecast(userCity) {
//     var


//   //variables for 5 day weather ajax call
//     var queryURLForecast ="https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat +"&lon=" +cityLon +"&exclude=current,minutely,hourly,alerts&appid=" +APIKey;

//     $.ajax({
//         url: queryURLForecast,
//         method: "GET",
//     }).then(function (responseF) {
//         console.log(responseF);
//         console.log(responseF.daily[1].dt);
//         var dateUnix = responseF.daily[1].dt;
//         var dateString = moment.unix(dateUnix).format("MM/DD/YYYY");
//         console.log(dateString);
//     });
// }

$("#submit-button").on("click", function (event) {
  event.preventDefault();
  $("#current-forecast").attr("style", "display: block;");
  $("#five-day").attr("style", "display: inline-block;");
  
  console.log("working");
  var userCity = $("#user-city").val();
  getWeather(userCity);
  cityHistory.push(userCity);
  renderCityHistory();
  localStorage.setItem("fetch", JSON.stringify(cityHistory));
//   getForecast(userCity);
});






renderCityHistory();

