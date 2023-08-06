class Weather {
  _searchInput = document.querySelector(".search");
  _inputField = document.querySelector(".search-input");
  _data;
  data;

  updateCurrentWeather(data) {
    const temp = document.querySelector(".current-weather-temp ");
    const weatherImg = document.querySelector(".sidebar--weather-temp-icon");
    const weatherCondition = document.querySelector(".sidebar--weather-status");
    const date = document.querySelector(".weather--date");
    const location = document.querySelector(".weather-location");
    const sunrise = document.querySelector(".sunrise-time");
    const sunset = document.querySelector(".sunset-time");
    const humidity = document.querySelector(".humidity-value");
    const pressure = document.querySelector(".pressure-value");
    const visibility = document.querySelector(".visibility-value");
    const feelsLike = document.querySelector(".feels-like-value");

    temp.textContent = `${data.temp.toFixed(1)}`;
    weatherImg.src = this._getWeatherIcon(data.curWeather[0].icon);
    weatherCondition.textContent = data.curWeather[0].main;
    date.textContent = this._getTime(data.time, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    location.textContent = `${data.name}, ${data.country}`;
    sunrise.textContent = this._getTime(data.sunrise, {
      hour: "numeric",
      minute: "numeric",
    });
    sunset.textContent = this._getTime(data.sunset, {
      hour: "numeric",
      minute: "numeric",
    });
    humidity.textContent = data.humidity;
    pressure.textContent = data.pressure;
    visibility.textContent = (data.visibility / 1000).toFixed(1);
    feelsLike.textContent = data.feelsLike;
  }

  renderHourlyWeather(data) {
    const parentEl = document.querySelector(".hourly-forecast");

    let markup = "";
    for (let i = 0; i < 8; i++) {
      markup += `
              <div class="hourly-forecast--card">
                <p class="hourly-forecast--time">${this._getTime(data.time[i], {
                  hour: "numeric",
                  minute: "numeric",
                })}</p>
                <img
                  src=${`https://openweathermap.org/img/wn/${data.weatherIcon[i]}@2x.png`}
                  alt="weather image"
                  class="hourly-forecast--img"
                />
                <p class="hourly-forecast--temp">${
                  data.temp[i]
                }<span>°</span></p>
              </div>
              `;
    }
    for (let i = 0; i < 8; i++) {
      markup += `
            <div class="hourly-forecast--card">
              <p class="hourly-forecast--time">${this._getTime(data.time[i], {
                hour: "numeric",
                minute: "numeric",
              })}</p>
              <img
                src="src/img/direction.png"
                alt="weather image"
                class="hourly-forecast--img"
                style="transform: rotate(${data.windDeg[i] + 180}deg)"
              />
              <p class="hourly-forecast--temp">${(
                data.windSpeed[i] * 3.6
              ).toFixed(1)}<span> km/h</span></p>
            </div>
      `;
    }
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("beforeend", markup);
  }
  renderFiveDayForecast(data) {
    const parentEl = document.querySelector(".sidebar--forecast-items");
    let markup = "";
    data.forEach((daily) => {
      markup += `
            <li class="sidebar--forecast-item">
              <div class="sidebar--forecast-temp">
                <img
                  src="https://openweathermap.org/img/wn/${daily[1]}@2x.png"
                  alt="weather image"
                />
                <p class="text">${Math.floor(daily[0])}°</p>
              </div>
              <p class="sidebar--forecast-date gray-text">${this._getTime(
                daily[2],
                { day: "numeric", month: "short" }
              )}</p>
              <p class="sidebar--forecast-day gray-text">${this._getTime(
                daily[2],
                { weekday: "long" }
              )}</p>
            </li>
      `;
    });
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("beforeend", markup);
  }
  renderAirPollution(data) {
    const parentEl = document.querySelector(".pollution-lists");
    const markup = `
                <i class="ph ph-wind highlight-icon"></i>
                <div class="pollution-list">
                  <p class="gray-text--sm">PM25</p>
                  <p class="text-bg">${data.pm25}</p>
                </div>
                <div class="pollution-list">
                  <p class="gray-text--sm">SO2</p>
                  <p class="text-bg">${data.so2}</p>
                </div>
                <div class="pollution-list">
                  <p class="gray-text--sm">NO2</p>
                  <p class="text-bg">${data.no2}</p>
                </div>
                <div class="pollution-list">
                  <p class="gray-text--sm">O3</p>
                  <p class="text-bg">${data.o3}</p>
                </div>
    `;
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("beforeend", markup);
  }
  _getTime(time, option) {
    return new Intl.DateTimeFormat(navigator.language, option).format(
      new Date(time * 1000)
    );
  }

  _getWeatherIcon(iconeCode) {
    return `https://openweathermap.org/img/wn/${iconeCode}@2x.png`;
  }
  addHandlerRenderWeather(handler) {
    this._searchInput.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
  addHandlerSearchResult(handler) {
    const inputField = this._inputField;
    this._inputField.addEventListener("input", function () {
      if (!inputField.value.trim()) return;
      handler(inputField.value);
    });
  }
  clearSearchResult() {
    const parentEl = document.querySelector(".search-select");
    const form = document.querySelector(".search");
    parentEl.innerHTML = "";
    form.classList.remove("res");
  }
  clearField() {
    this._inputField.value = "";
    this._inputField.blur();
  }
  renderSearchResult(data) {
    const parentEl = document.querySelector(".search-select");
    const form = document.querySelector(".search");
    const markup = `
          <div class="search-result">
            <div class="results">
              <i class="ph ph-map-pin"></i>
              <div>
                <div class="city-name">${data.name}</div>
                <div class="state-A-country-name">${data.state}, ${data.country}</div>
              </div>
            </div>
          </div>
    `;
    parentEl.innerHTML = "";
    form.classList.remove("res");
    parentEl.insertAdjacentHTML("beforeend", markup);
    form.classList.add("res");
  }
  addHandlerResult(handler) {
    const parentEl = document.querySelector(".search-select");
    parentEl.addEventListener("click", function (e) {
      const target = e.target.closest(".results");
      if (!target) return;
      const city = target.querySelector(".city-name").textContent;
      handler(city);
    });
  }
}
export default new Weather();
