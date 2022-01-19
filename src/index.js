function formatDate(date) {
  var hours = date.getHours();

  if (hours < 10) {
    hours = "0".concat(hours);
  }

  var minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = "0".concat(minutes);
  }

  var dayNumber = date.getDay();
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var day = days[dayNumber];
  return "".concat(day, " ").concat(hours, ":").concat(minutes);
}

var dateElement = document.querySelector("#date");
var currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

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
    response.data.weather[0].main;
}

function getCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayWeather);
}

function citySubmit(event) {
  event.preventDefault();
  var city = document.querySelector("#city-input").value;
  getCity(city);
}

var searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", citySubmit);

function getLocation(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

var currentLocationButton = document.querySelector("#current-input");
currentLocationButton.addEventListener("click", getCurrentLocation);

getCity("Charlotte");
