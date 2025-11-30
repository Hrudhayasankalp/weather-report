// ...existing code...
const weatherform = document.querySelector(".weatherform");
const cityinput = document.querySelector(".cityinput");
const card = document.querySelector(".card");
const apikey = "6417a0bfab338bc86a6401dcbd9ccf2a";


weatherform && weatherform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityinput.value.trim();
    if (city) {
        try {
            const weatherData = await getweatherdata(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter the city");
    }
});

async function getweatherdata(city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apikey}`;
    const response = await fetch(apiurl);
    if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(`Could not fetch the weather data${text ? ": " + text : ""}`);
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    if (!data || !data.main || !Array.isArray(data.weather) || !data.weather.length) {
        displayError("Invalid weather data");
        return;
    }

    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data;

    card.textContent = "";
    card.style.display = "flex";

    const citydisplay = document.createElement("h1");
    const tempdisplay = document.createElement("p");
    const humiditydisplay = document.createElement("p");
    const descdisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    citydisplay.textContent = city;
    tempdisplay.textContent = `${(temp - 273.15).toFixed(1)} °C`;
    humiditydisplay.textContent = `Humidity: ${humidity}%`;
    descdisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    citydisplay.classList.add("citydisplay");
    tempdisplay.classList.add("tempdisplay");
    humiditydisplay.classList.add("humiditydisplay");
    descdisplay.classList.add("descdisplay");

    card.appendChild(citydisplay);
    card.appendChild(tempdisplay);
    card.appendChild(humiditydisplay);
    card.appendChild(descdisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
    if (typeof weatherId !== "number") return "❓";
    if (weatherId >= 200 && weatherId < 300) return "⛈"; 
    if (weatherId >= 300 && weatherId < 400) return "🌦"; 
    if (weatherId >= 500 && weatherId < 600) return "🌧"; 
    if (weatherId >= 600 && weatherId < 700) return "❄"; 
    if (weatherId >= 700 && weatherId < 800) return "🌫"; 
    if (weatherId === 800) return "☀";                  
    if (weatherId > 800 && weatherId < 900) return "☁"; 
    return "❓";
}

function displayError(messageOrError) {
    const message = typeof messageOrError === "string"
        ? messageOrError
        : (messageOrError && messageOrError.message) || "An error occurred";

    card.textContent = "";
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errordisplay");

    card.appendChild(errorDisplay);
}
