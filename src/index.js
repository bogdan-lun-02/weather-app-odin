import "./styles.css";
import { format } from "date-fns";

import snowImg from "./weather-icons/snow.png";
import rainImg from "./weather-icons/rain.png";
import fogImg from "./weather-icons/fog.png";
import windImg from "./weather-icons/wind.png";
import cloudyImg from "./weather-icons/cloudy.png";
import partlyCloudyDayImg from "./weather-icons/partly-cloudy-day.png";
import partlyCloudyNightImg from "./weather-icons/partly-cloudy-night.png";
import clearDayImg from "./weather-icons/clear-day.png";
import clearNightImg from "./weather-icons/clear-night.png";

const locationInput = document.querySelector("#locationInput");
const searchButton = document.querySelector("#searchButton");
const location = document.querySelector("#location");
const time = document.querySelector("#time");
const weatherIcon = document.querySelector("#weatherIcon");
const temperature = document.querySelector("#temperature");
const minmaxTemperature = document.querySelector("#minmaxTemp");
const tempSign = document.createElement("span");
const description = document.querySelector("#description");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const daysCont = document.querySelector("#daysCont");
const loadingDiv = document.getElementById("loading");

const weatherIcons = {
  snow: snowImg,
  rain: rainImg,
  fog: fogImg,
  wind: windImg,
  cloudy: cloudyImg,
  "partly-cloudy-day": partlyCloudyDayImg,
  "partly-cloudy-night": partlyCloudyNightImg,
  "clear-day": clearDayImg,
  "clear-night": clearNightImg,
};

const backgroundColors = {
  "clear-day": "#00BFFF",
  "clear-night": "#2C3E50",
  "partly-cloudy-day": "#708090",
  "partly-cloudy-night": "#708090",
  cloudy: "#708090",
  rain: "#696969",
  snow: "#B0E0E6",
  fog: "#D3D3D3",
  wind: "#A9C4D8",
};

function chooseBackgroundColor(data) {
  document.body.style.backgroundColor = backgroundColors[data.icon];
}

// loadingDiv.addEventListener("click", hideSpinner);

function showSpinner() {
  loadingDiv.style.display = "block";
}

function hideSpinner() {
  loadingDiv.style.display = "none";
}

async function fetchWeatherData(location) {
  let baseAPI =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/location?unitGroup=metric&key=5EQ6VA7UQLH2SP4CAHMP2HW7K&contentType=json";
  baseAPI = baseAPI.replace("location", location);
  const response = await fetch(baseAPI, {
    mode: "cors",
  });
  const unprocessedWeatherData = await response.json();

  const processedWeatherData = processWeatherData(unprocessedWeatherData);
  console.log(processedWeatherData);
  displayWeatherData(processedWeatherData);
  chooseBackgroundColor(processedWeatherData);
  displayDays(processedWeatherData);
}

function displayDays(data) {
  daysCont.innerHTML = "";
  data.days.forEach((element, index) => {
    const dayDiv = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = `${format(new Date(element.datetime), "dd MMMM, yyyy")}`;
    const p2 = document.createElement("p");
    p2.textContent = `${element.temp}`;
    dayDiv.classList.add("day");
    dayDiv.addEventListener("click", () =>
      displayNextDay(data.days[index], data.address),
    );
    dayDiv.append(p, p2);
    daysCont.append(dayDiv);
  });
}

function displayWeatherData(data) {
  location.textContent = data.address;
  time.textContent = data.time;
  weatherIcon.setAttribute("src", weatherIcons[data.icon]);
  weatherIcon.alt = data.icon;
  temperature.textContent = data.temp;
  temperature.append(tempSign);
  tempSign.textContent = "°C";
  minmaxTemperature.textContent = `High/Low: ${data.days[0].tempmax}°C/${data.days[0].tempmin}°C`;
  description.textContent = data.desc;
  humidity.textContent = "Humidity: " + data.humidity;
  wind.textContent = "Wind speed: " + data.wind + "km/h";
  hideSpinner();
}

function displayNextDay(data, loc) {
  location.textContent = loc;
  time.textContent = format(new Date(data.datetime), "dd MMMM, yyyy");
  weatherIcon.setAttribute("src", weatherIcons[data.icon]);
  weatherIcon.alt = data.icon;
  temperature.textContent = data.temp;
  temperature.append(tempSign);
  tempSign.textContent = "°C";
  minmaxTemperature.textContent = `High/Low: ${data.tempmax}°C/${data.tempmin}°C`;
  description.textContent = data.conditions;
  humidity.textContent = "Humidity: " + data.humidity;
  wind.textContent = "Wind speed: " + data.windspeed + "km/h";
}

function processWeatherData(data) {
  console.log(data);

  return {
    address: data.address,
    icon: data.currentConditions.icon,
    temp: data.currentConditions.temp,
    currentCondition: data.currentConditions.conditions,
    desc: data.currentConditions.conditions,
    time: format(new Date(data.days[0].datetime), "dd MMMM, yyyy"),
    humidity: data.currentConditions.humidity,
    wind: data.currentConditions.windspeed,
    days: data.days,
  };
}

fetchWeatherData("Kyiv");
searchButton.addEventListener("click", () => {
  const location = locationInput.value;
  if (location) {
    showSpinner();
    fetchWeatherData(location);
  }
});
