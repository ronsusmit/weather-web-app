let button = document.getElementById("button");
let search = document.getElementById("search");

let cityNameOut = document.getElementById("city-name");
let todayTempOut = document.getElementById("today-temp");
let todayFeelsLikeOut = document.getElementById("today-feels-like");
let todayWindOut = document.getElementById("today-wind");
let todayHumidityOut = document.getElementById("today-humidity");
let upcomingWeatherDiv = document.getElementById("days");

button.addEventListener("click", () => {
    let city = search.value;
    let apiKey = '1e5efb64cf75e8c5b619fbe10b306326';
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response is not ok');
            }
            return response.json();
        })
        .then(data => {
            cityNameOut.innerHTML = "";
            todayTempOut.innerHTML = "";
            todayFeelsLikeOut.innerHTML = "";
            todayWindOut.innerHTML = "";
            todayHumidityOut.innerHTML = "";
            upcomingWeatherDiv.innerHTML = "";

            if (data && data.list && data.list.length > 0) {
                // Display today's weather (the first forecast in the list)
                let todayForecast = data.list[0];
                let todayTemp = (todayForecast.main.temp - 273.15).toFixed(); // Convert Kelvin to Celsius
                let todayFeelsLike = (todayForecast.main.feels_like - 273.15).toFixed(); // Convert Kelvin to Celsius
                let todayHumidity = todayForecast.main.humidity;
                let todayWind = (todayForecast.wind.speed * 3.6).toFixed(2); // Convert m/s to km/h

                cityNameOut.innerHTML = `<i class="ri-map-pin-2-fill"></i>${data.city.name}`;
                todayTempOut.innerHTML = `<div class = temp_sign><i class="ri-temp-hot-line"></i>${todayTemp}<sup>°</sup></div>`;
                todayFeelsLikeOut.innerHTML = `Feels Like: ${todayFeelsLike}°`;
                todayWindOut.innerHTML = `<i class="ri-windy-line"></i> ${todayWind} km/h`;
                todayHumidityOut.innerHTML = `<i class="ri-water-percent-line"></i> ${todayHumidity}%`;

                // Display upcoming 4 days forecast
                let forecasts = data.list.slice(1, 5);
                forecasts.forEach((forecast, index) => {
                    let temp = (forecast.main.temp - 273.15).toFixed(1);
                    let feelsLike = (forecast.main.feels_like - 273.15).toFixed(1);
                    let dateObj = new Date(forecast.dt_txt);
                    let day = getDayName((new Date().getDay() + index + 1) % 7);

                    let forecastDiv = document.createElement("div");
                    forecastDiv.className = "forecast";
                    forecastDiv.innerHTML = `
                        <div class = per_day><p>${day}</p><div>
                        <div class = per_day><p> ${temp}°C</p><div>
                        <div class = per_day><p>Feels Like: ${feelsLike}°C</p><div>
                    `;
                    upcomingWeatherDiv.appendChild(forecastDiv);
                });
            } else {
                cityNameOut.innerHTML = `No forecast data available for "${city}".`;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            cityNameOut.innerHTML = `Error: Could not retrieve data for "${city}". Please try again.`;
        });
});

function getDayName(dayIndex) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[dayIndex];
}
