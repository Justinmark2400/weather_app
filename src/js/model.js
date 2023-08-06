import { API_KEY } from "./config.js";
import { getJSON } from "./helpers.js";
const state = {
  city: "",
  lat: "",
  lng: "",
  currentWeather: {},
  airPollution: {},
  fiveDayForecast: [],
  hourlyWeather: {},
};

const getCurrentWeather = async function (city) {
  try {
    const data = await getJSON(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    state.lat = data.coord.lat;
    state.lng = data.coord.lon;

    state.currentWeather = {
      time: data.dt,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      name: data.name,
      country: data.sys.country,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      visibility: data.visibility,
      curWeather: data.weather,
    };
  } catch (err) {
    console.error(err.message);
  }
};

const getHourlyWeather = async function (city) {
  try {
    const data = await getJSON(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    (state.hourlyWeather = {
      time: [],
      weatherIcon: [],
      temp: [],
      windDeg: [],
      windSpeed: [],
    }),
      data.list.slice(0, 8).forEach((data) => {
        state.hourlyWeather.time.push(data.dt);
        state.hourlyWeather.weatherIcon.push(data.weather[0].icon);
        state.hourlyWeather.temp.push(data.main.temp);
        state.hourlyWeather.windDeg.push(data.wind.deg);
        state.hourlyWeather.windSpeed.push(data.wind.speed);
      });
    return data.list;
  } catch (err) {
    console.error(err.message);
  }
};

const getFiveDayForeCast = async function (data) {
  try {
    // state.fiveDayForecast = {
    // days: [],
    // };
    state.fiveDayForecast = [];

    let start = 0;
    let end = 8;
    for (let i = 0; i < 5; i++) {
      let temp = 0;
      let icon = "";
      let time = 0;
      data.slice(start, end).forEach((forecast) => {
        if (forecast.main.temp_max > temp) {
          temp = forecast.main.temp_max;
          icon = forecast.weather[0].icon;
          time = forecast.dt;
        }
      });
      // state.fiveDayForecast.days.push([temp, icon, time]);
      state.fiveDayForecast.push([temp, icon, time]);

      start += 8;
      end += 8;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const getAirPollution = async function (lat, lng) {
  try {
    console.log(lat, lng);
    const date = await getJSON(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    );
    state.airPollution = {
      aqi: date.list[0].main.aqi,
      pm25: date.list[0].components.pm2_5,
      so2: date.list[0].components.so2,
      no2: date.list[0].components.no2,
      o3: date.list[0].components.o3,
    };
  } catch (err) {
    console.error(err.message);
  }
};

export const getWeather = async function (city) {
  state.city = city;
  await getCurrentWeather(city);
  const dataForDailyForecast = await getHourlyWeather(city);
  await getAirPollution(state.lat, state.lng);
  await getFiveDayForeCast(dataForDailyForecast);
};

export const getSearchReslt = async function (input) {
  try {
    const data = await getJSON(
      `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${1}&appid=${API_KEY}`
    );
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

export default state;
