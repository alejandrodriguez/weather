const submitBtn = document.querySelector("#submit");
let weatherDiv = document.querySelector(".weather-info");
let tempInFahrenheit;

function changeUnits(units) {
    let newTemperature;
    switch (units) {
        case "fahrenheit":
            newTemperature = tempInFahrenheit.toFixed(0) + " °F";
            document
                .querySelector(".fahrenheit")
                .classList.add("selected-unit");
            document
                .querySelector(".celsius")
                .classList.remove("selected-unit");
            document.querySelector(".kelvin").classList.remove("selected-unit");
            break;
        case "celsius":
            newTemperature =
                ((tempInFahrenheit - 32) * (5 / 9)).toFixed(0) + " °C";
            document.querySelector(".celsius").classList.add("selected-unit");
            document
                .querySelector(".fahrenheit")
                .classList.remove("selected-unit");
            document.querySelector(".kelvin").classList.remove("selected-unit");
            break;
        case "kelvin":
            newTemperature =
                ((tempInFahrenheit - 32) * (5 / 9) + 273.15).toFixed(0) + " K";
            document.querySelector(".kelvin").classList.add("selected-unit");
            document
                .querySelector(".fahrenheit")
                .classList.remove("selected-unit");
            document
                .querySelector(".celsius")
                .classList.remove("selected-unit");
            break;
    }
    document.querySelector("#weather-text").textContent = newTemperature;
}

function changeStyleWithId(id) {
    const icon = document.querySelector(".icon-img");
    if (id >= 200 && id <= 232) {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/thunderstorm.jpg")`;
        icon.src = "./img/icons/thunderstorm-icon.png";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/rain.jpg")`;
        icon.src = "./img/icons/rain-icon.png";
    } else if (id >= 600 && id <= 622) {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/snow.jpg")`;
        icon.src = "./img/icons/snow-icon.png";
    } else if (id >= 701 && id <= 781) {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/fog.jpg")`;
        icon.src = "./img/icons/fog-icon.png";
    } else if (id === 800) {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/clear.jpg")`;
        icon.src = "./img/icons/clear-icon.png";
    } else if (id >= 801 && id <= 804) {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/cloudy.jpg")`;
        icon.src = "./img/icons/cloudy-icon.png";
    } else {
        document.body.style.backgroundImage = `
            linear-gradient(
            rgba(255, 255, 255, 0.7),
            rgba(0, 0, 0, 0.7)
            ),
            url("./img/default.jpg")`;
    }
}

async function callAPI(e) {
    e.preventDefault();
    e.target.disabled = true;
    const prevWeatherDivClone = weatherDiv.cloneNode(true);
    const cityInput = document.querySelector("#city");
    const city = cityInput.value;
    if (!city) {
        return;
    }
    const loading = document.createElement("div");
    loading.textContent = "...";
    while (weatherDiv.lastChild) {
        weatherDiv.removeChild(weatherDiv.lastChild);
    }
    weatherDiv.append(loading);
    try {
        const cityResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=2cbd2b7f85f97cf26d0a4ad15a72253f`
        );
        if (!cityResponse.ok) {
            return;
        }
        const cityData = await cityResponse.json();
        const lon = cityData[0].lon;
        const lat = cityData[0].lat;
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2cbd2b7f85f97cf26d0a4ad15a72253f&units=imperial`
        );
        if (!weatherResponse.ok) {
            return;
        }
        const weatherData = await weatherResponse.json();
        tempInFahrenheit = weatherData.main.temp;
        const weatherText = document.createElement("div");
        weatherText.textContent = tempInFahrenheit.toFixed(0) + " °F";
        weatherText.id = "weather-text";
        const selectUnits = document.createElement("div");
        selectUnits.classList.add("select-units");
        const fahrenheit = document.createElement("p");
        fahrenheit.textContent = "°F";
        fahrenheit.classList.add("fahrenheit", "selected-unit");
        fahrenheit.addEventListener("click", () => changeUnits("fahrenheit"));
        const celsius = document.createElement("p");
        celsius.textContent = "°C";
        celsius.classList.add("celsius");
        celsius.addEventListener("click", () => changeUnits("celsius"));
        const kelvin = document.createElement("p");
        kelvin.textContent = "K";
        kelvin.classList.add("kelvin");
        kelvin.addEventListener("click", () => changeUnits("kelvin"));
        selectUnits.append(celsius, fahrenheit, kelvin);
        loading.remove();
        changeStyleWithId(weatherData.weather[0].id);
        document.querySelector("h1").textContent = weatherData.name;
        document.querySelector(".icon-wrapper > p").textContent =
            weatherData.weather[0].main || "";
        weatherDiv.append(weatherText, selectUnits);
    } catch (error) {
        weatherDiv.parentElement.insertBefore(prevWeatherDivClone, weatherDiv);
        weatherDiv.remove();
        weatherDiv = prevWeatherDivClone;
        return;
    }
    e.target.disabled = false;
}

submitBtn.addEventListener("click", e => callAPI(e));
