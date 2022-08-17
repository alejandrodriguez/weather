const submitBtn = document.querySelector("#submit");
let weatherDiv = document.querySelector(".weather-info");
let tempInFarenheit;

function changeUnits(units) {
    let newTemperature;
    switch (units) {
        case "farenheit":
            newTemperature = tempInFarenheit.toFixed(0) + " °F";
            document.querySelector(".farenheit").classList.add("selected-unit");
            document
                .querySelector(".celsius")
                .classList.remove("selected-unit");
            document.querySelector(".kelvin").classList.remove("selected-unit");
            break;
        case "celsius":
            newTemperature =
                ((tempInFarenheit - 32) * (5 / 9)).toFixed(0) + " °C";
            document.querySelector(".celsius").classList.add("selected-unit");
            document
                .querySelector(".farenheit")
                .classList.remove("selected-unit");
            document.querySelector(".kelvin").classList.remove("selected-unit");
            break;
        case "kelvin":
            newTemperature =
                ((tempInFarenheit - 32) * (5 / 9) + 273.15).toFixed(0) + " K";
            document.querySelector(".kelvin").classList.add("selected-unit");
            document
                .querySelector(".farenheit")
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
        tempInFarenheit = weatherData.main.temp;
        const weatherText = document.createElement("div");
        weatherText.textContent = tempInFarenheit.toFixed(0) + " °F";
        weatherText.id = "weather-text";
        const selectUnits = document.createElement("div");
        selectUnits.classList.add("select-units");
        const farenheit = document.createElement("p");
        farenheit.textContent = "°F";
        farenheit.classList.add("farenheit", "selected-unit");
        farenheit.addEventListener("click", () => changeUnits("farenheit"));
        const celsius = document.createElement("p");
        celsius.textContent = "°C";
        celsius.classList.add("celsius");
        celsius.addEventListener("click", () => changeUnits("celsius"));
        const kelvin = document.createElement("p");
        kelvin.textContent = "K";
        kelvin.classList.add("kelvin");
        kelvin.addEventListener("click", () => changeUnits("kelvin"));
        selectUnits.append(celsius, farenheit, kelvin);
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
}

submitBtn.addEventListener("click", e => callAPI(e));
