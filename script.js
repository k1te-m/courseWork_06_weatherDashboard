//Global API Key and getItem for cityHistory
var APIKey = "96f3dfbfcb0c17c6b7abf0c008b21dd6";
let cityHistory = JSON.parse(localStorage.getItem("fetch")) || [];

//function to retrieve current weather forecast
function getWeather(userCity) {
  $("#weather").empty(); //ensures no duplicate cards
  $("#forecast").empty();  //ensures no duplicate cards
  var queryURLWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity +
    "&appid=" +
    APIKey;

  $.ajax({ // ajax call for current weather
    url: queryURLWeather,
    method: "GET",
  }).then(function (responseW) {

    //variables for current forecast ajax call to build card for display
    var cardEl = $("<div>").addClass("card").attr("style", "width: 100%");
    cardEl.attr("id", "currentday-weather");
    var cardBodyEl = $("<div>").addClass("card-body");
    var currentDateEl = $("<div>").text(moment().format("MMMM Do YYYY")); //creates div displaying current date in month, day, year format
    currentDateEl.addClass("card-title");
    var cityNameEl = $("<div>").text(responseW.name); //creates div displaying city name of user input
    cityNameEl.addClass("card-subtitle mb-2");
    var weatherIcon = responseW.weather[0].icon; //pulls the weather icon used by openweather
    var weatherIconURL =
      "https://openweathermap.org/img/w/" + weatherIcon + ".png"; //retrieves icon picture from openweather
    var weatherIconEl = $("<img>").attr("src", weatherIconURL); //creates image element with source of url from openweather
    var currentTemp = $("<div>").text(
      "Temperature: " +
        Math.floor((responseW.main.temp - 273.15) * 1.8 + 32) +
        "°"
    ); //creates element to display current temp in fahrenheit
    currentTemp.addClass("card-text");
    var currentHumEl = $("<div>").text(
      "Humidity: " + responseW.main.humidity + "%"
    );//creates element to display current humidity %
    currentHumEl.addClass("card-text");
    var currentWindSEl = $("<div>").text(
      "Wind Speed: " + Math.floor(responseW.wind.speed * 2.23694) + "mph"
    ); //creates element to display current wind speed
    currentWindSEl.addClass("card-text");

    var currentWeatherCard = cardEl.append( //creates variable establishing current weather card for display
      cardBodyEl.prepend(
        currentDateEl,
        cityNameEl.append(weatherIconEl),
        currentTemp,
        currentHumEl,
        currentWindSEl
      )
    );

    //rendering of current forecast card
    $("#weather").append(currentWeatherCard); //appends the weathercard to the weather section hardcoded to HTML

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
        var UVindex = responseUV.value; //grabs the current UV index from openweather API
        var uvIndexEl = $("<div>").text("UV Index: " + UVindex); //creates element to display current UV index
        if (UVindex <= 2.99) { //logic for updating CSS styling based on UV index value
          uvIndexEl.addClass("lowUV");
        } else if (UVindex >= 3.0 && UVindex <= 7.99) {
          uvIndexEl.addClass("moderateUV");
        } else if (UVindex >= 8) {
          uvIndexEl.addClass("extremeUV");
        }

        uvIndexEl.addClass("card-text");
        currentWindSEl.append(uvIndexEl); //appends the uv index element to wind speed so it is captured by in prior appending
      });
      function getForecast(userCity) {
        var queryURLForecast =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&exclude=current,minutely,hourly,alerts&appid=" +
          APIKey;
        $.ajax({ //ajax call for future forecast, uses the cityLat/cityLon taken from the UVIndex ajax call
          url: queryURLForecast,
          method: "GET",
        }).then(function (responseF) {
          var dateUnix = responseF.daily[1].dt; //grabs the date for next day through openweather API call in UNIX format
          var dateString = moment.unix(dateUnix).format("MM/DD/YYYY"); //utilizes the momentjs .unix method to convert API response and format in month, day, year format

          for (i = 1; i <= 5; i++) { //loop to create individual cards for each day in five day forecast, the rest follows similar logic to the creation of the current day weather card
            var dateUnix = responseF.daily[i].dt;
            var dateString = moment.unix(dateUnix).format("MMMM Do YYYY");

            var forecastIcon = responseF.daily[i].weather[0].icon;
            var forecastIconURL =
              "https://openweathermap.org/img/w/" + forecastIcon + ".png";
            var forecastIconEl = $("<img>").attr("src", forecastIconURL);

            var forecastTemp = Math.floor(
              (responseF.daily[i].temp.max - 273.15) * 1.8 + 32
            );

            var forecastHum = responseF.daily[i].humidity;

            var forecastCardEl = $("<div>")
              .addClass("card")
              .attr("style", "width: 100%");
            forecastCardEl.attr("date-index", "day-" + i);
            var forecastCardBodyEl = $("<div>").addClass(
              "card-body forecast-card"
            );
            var forecastDateEl = $("<div>").text(dateString);
            forecastDateEl.addClass("card-title");
            var forecastTempEl = $("<div>").text(
              "Temperature: " + forecastTemp + "°"
            );
            forecastTempEl.addClass("card-text");
            var forecastHumEl = $("<div>").text(
              "Humidity: " + forecastHum + "%"
            );
            forecastHumEl.addClass("card-text");

            var colEl = $("<div>").addClass("col mb-2");

            var forecastCard = colEl.append(
              forecastCardEl.append(
                forecastCardBodyEl.prepend(
                  forecastDateEl,
                  forecastTempEl.prepend(forecastIconEl, $("<br>")),
                  forecastHumEl
                )
              )
            );

            $("#forecast").append(forecastCard);
          }
        });
      }
      getForecast(userCity); // call the five-day forecast function
    }

    getUVIndex(userCity); // call the UV index function
  });
}

function renderCityHistory() { //runs a loop that creates a list group item for cities captured in local storage
  $("#city-list").html("");
  for (let i = 0; i < cityHistory.length; i++) {
    var cityEl = $("<li>").addClass("list-group-item d-block");
    cityEl.text(cityHistory[i]);

    $("#city-list").append(cityEl); //appends the list items to the hardcoded UL element
  }
  $("li").on("click", function () { //on click event listener to run getWeather/getForecast/getUVindex functions for the stored city
    getWeather($(this).text());
  });
}

$("#submit-button").on("click", function (event) { //on click event for the search/submit button to run all weather functions/set local storage
  event.preventDefault();
  $("#current-forecast").attr("style", "display: block;");
  $("#five-day").attr("style", "display: inline-block;");
  var userCity = $("#user-city").val();
  getWeather(userCity);
  if (userCity !== "") {
  cityHistory.push(userCity);
  } else {
    alert("Please enter a city.");
  }
  renderCityHistory();
  localStorage.setItem("fetch", JSON.stringify(cityHistory));
});

renderCityHistory(); //ensures history is rendered on load
if (cityHistory.length > 0) {
  getWeather(cityHistory[cityHistory.length - 1]);
}