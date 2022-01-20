//display date and time in the fotmat: date hh:mm
function formatDate(timestamp) {
  var date = new Date(timestamp);

  var hours = date.getHours();
  if (hours < 10) {
    hours = "0".concat(hours);
  }

  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0".concat(minutes);
  }

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

//date for forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

var dateElement = document.querySelector("#date");
var currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

//unit conversion
let unit = "metric";
let fahrenheit = document.querySelector("#fahrenheit");
let celsius = document.querySelector("#celsius");
let km = document.querySelector("#km");
fahrenheit.style.color = "#3a40f1";

function metricUnit() {
  unit = "metric";
  celsius.style.color = "#000000";
  fahrenheit.style.color = "#3a40f1";
  km.innerHTML = "km/h";
  getCityWeather(document.querySelector("#city").innerHTML, unit);
}

function imperialUnit() {
  unit = "imperial";
  fahrenheit.style.color = "#000000";
  celsius.style.color = "#3a40f1";
  km.innerHTML = "mph";
  getCityWeather(document.querySelector("#city").innerHTML, unit);
}

fahrenheit.addEventListener("click", imperialUnit);
celsius.addEventListener("click", metricUnit);

//weather forecast
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="forecast-temp">
        <span class="forecast-temp-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span><span class="forecast-temp-max"> ${Math.round(
          forecastDay.temp.max
        )}° </span></div>
        </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(displayForecast);
}

//display elements in corresponding places
function displayWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

//search for weather at a city
function getCityWeather(city, unit) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(displayWeather);
}

function citySubmit(event) {
  event.preventDefault();
  var city = document.querySelector("#city-input").value;
  getCityWeather(city, unit);
}

var searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", citySubmit);

//search for weather at the current location
function getLocation(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(url).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

var currentLocationButton = document.querySelector("#current-input");
currentLocationButton.addEventListener("click", getCurrentLocation);

//initial display when first open the page
getCityWeather("Charlotte", unit);
