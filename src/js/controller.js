import { API_KEY } from "./config.js";
import * as model from "./model.js";
import view from "./view.js";

const inputField = document.querySelector(".search-input");

const renderWeatherData = async function () {
  console.log(model.default);
  view.updateCurrentWeather(model.default.currentWeather);
  view.renderHourlyWeather(model.default.hourlyWeather);
  view.renderFiveDayForecast(model.default.fiveDayForecast);
  view.renderAirPollution(model.default.airPollution);
};

const controlWeather = async function (city) {
  view.clearField();
  view.clearSearchResult();
  if (city) {
    await model.getWeather(city);
  } else {
    const input = inputField.value.trim();
    inputField.value = "";
    inputField.blur();
    if (!input) return;
    console.log(input);

    await model.getWeather(input);
  }
  renderWeatherData();
};

const controlSearchResult = async function (input) {
  const [data] = await model.getSearchReslt(input);
  if (!data) return;
  view.renderSearchResult(data);
};

const init = function () {
  view.addHandlerSearchResult(controlSearchResult);
  view.addHandlerRenderWeather(controlWeather);
  view.addHandlerResult(controlWeather);
};

init();
