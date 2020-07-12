const searchResultsEl = document.querySelector("#search-results");
const searchFormEl = document.querySelector("#search");
const citySearchEl = document.querySelector("#search-city");
const currentWeatherEl = document.querySelector("#current-weather");
const cityNameEl = document.querySelector("#city-namedate");
const forecastEl = document.querySelector("#forecast");
const searchHistoryEl = document.querySelector("#search-history");
let pastCities = [];

const formSubmitHandler = function(event) {
    event.preventDefault();

    let searchCity = citySearchEl.value.trim(); 
    
    if (searchCity) {
        getCurrentWeather(searchCity);
        getForecast(searchCity);
        logSearchCity(searchCity);
    } else {
        alert("Please enter a city.");
    }
}

const getCurrentWeather = function(searchCity) {
    let apiCity = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=bce603202b1195d47aa1fdd3412da455";
    

    fetch(apiCity).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                displayCurrent(data, searchCity);
                getCurrentUV(data.coord.lat, data.coord.lon);
          }  
        )}
    })
}



// add retrieved current weather
const displayCurrent = function(searchData, city) {
    let date = moment().format("L");

    cityNameEl.textContent = "";
    currentWeatherEl.innerHTML = "";

    cityNameEl.textContent = city + " (" + date + ")";
    
    let tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + searchData.main.temp;
    tempEl.className = "weather-data";

    let humitdityEl = document.createElement("p")
    humitdityEl.textContent = "Humidity: " + searchData.main.humidity +"%";
    humitdityEl.className = "weather-data";

    let windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + searchData.wind.speed + "MPH";
    windEl.className = "weather-data";

    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(humitdityEl);
    currentWeatherEl.appendChild(windEl);



};

const getCurrentUV = function(latitude, longitude) {
    let cityLocationRequest = "http://api.openweathermap.org/data/2.5/uvi?appid=bce603202b1195d47aa1fdd3412da455&lat=" + latitude + "&lon=" + longitude;
    fetch(cityLocationRequest).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // we have the UV index under "value"
            let uvIndex = data.value;
            
            let uvIndexEl = document.createElement("p");
            uvIndexEl.classList = "weather-data";
            uvIndexEl.textContent = "UV Index:";
            if (uvIndex <= 2) {
                let uvNumberEl = document.createElement("span");
                uvNumberEl.className = "favorable-uv";
                uvNumberEl.textContent = uvIndex;
                uvIndexEl.appendChild(uvNumberEl);
                currentWeatherEl.appendChild(uvIndexEl);
            } else if (2 < uvIndex && uvIndex <= 6) {
                let uvNumberEl = document.createElement("span");
                uvNumberEl.className = "moderate-uv";
                uvNumberEl.textContent = uvIndex;
                uvIndexEl.appendChild(uvNumberEl);
                currentWeatherEl.appendChild(uvIndexEl);
            } else if (6 < uvIndex && uvIndex<= 8) {
                let uvNumberEl = document.createElement("span");
                uvNumberEl.className = "high-uv";
                uvNumberEl.textContent = uvIndex;
                uvIndexEl.appendChild(uvNumberEl);
                currentWeatherEl.appendChild(uvIndexEl);
            } else if (8 < uvIndex && uvIndex <= 10){
                let uvNumberEl = document.createElement("span");
                uvNumberEl.className = "very-high-uv";
                uvNumberEl.textContent = uvIndex;
                uvIndexEl.appendChild(uvNumberEl);
                currentWeatherEl.appendChild(uvIndexEl);
            } else if (uvIndex > 10) {
                let uvNumberEl = document.createElement("span");
                uvNumberEl.className = "extreme-uv";
                uvNumberEl.textContent = uvIndex;
                uvIndexEl.appendChild(uvNumberEl);
                currentWeatherEl.appendChild(uvIndexEl);
            }
            })
        } else {
            alert("Unable to retrieve data. Please try again.");
        }
    })
}

const getForecast = function(city) {
    let apiCity = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bce603202b1195d47aa1fdd3412da455";

    forecastEl.innerHTML = "";
    forecastEl.textContent = "";
    fetch(apiCity).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                for (let i = 1; i < 6; i++) {
                  let temp = data.list[i].main.temp;
                  let humidity = data.list[i].main.humidity;
                  let date = (moment().add(i, "days")).format("MM/DD/YYYY");
                  let icon = data.list[i].weather[0].icon;
                  
                  // create forecast card
                  let dailyForecastEl = document.createElement("div");
                  dailyForecastEl.classList = "card mx-2 my-3 p-1 future-weather";
                // create and add data components to the card
                  let forecastDateHeader = document.createElement("div")
                  forecastDateHeader.className = "card-title";
                  forecastDateHeader.textContent = date;
                  dailyForecastEl.appendChild(forecastDateHeader);
                  
                  let weatherIconEl = document.createElement("img")
                  weatherIconEl.className = "w-50"
                  weatherIconEl.setAttribute("src", " http://openweathermap.org/img/wn/" + icon +".png");
                  dailyForecastEl.appendChild(weatherIconEl);
                  let forecastDailyData = document.createElement("div");
                  forecastDailyData.className = "card-text";
                  forecastDailyData.innerHTML = "<p>Temp: " + temp + "&#176F</p> <p>Humidity: " + humidity + "%</p>";
                  dailyForecastEl.appendChild(forecastDailyData);

                  forecastEl.appendChild(dailyForecastEl);
                  
                }
            })
        }
    })
};

const logSearchCity = function(city) {
    let previousSearch = document.createElement("button");
    previousSearch.classList = "list-group-item list-group-item-action";
    previousSearch.setAttribute("type", "button");
    previousSearch.textContent = city;
    searchHistoryEl.appendChild(previousSearch);

    pastCities.push(city);
    
    localStorage.setItem("cities", JSON.stringify(pastCities));
};

const historySearchHandler = function() {
    let city = event.target.textContent;
    

    getCurrentWeather(city);
    getForecast(city);
}

const loadSearchHistory = function() {
    let retrievedCities = JSON.parse(localStorage.getItem("cities"));
    
    pastCities = pastCities.concat(retrievedCities);

    for(let i = 0; i < retrievedCities.length; i++) {
        let pastCityEl = document.createElement("button");
        pastCityEl.classList = "list-group-item list-group-item-action";
        pastCityEl.setAttribute("type", "button");
        pastCityEl.textContent = retrievedCities[i];

        searchHistoryEl.appendChild(pastCityEl);
    }
}

searchFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryEl.addEventListener("click", historySearchHandler);

loadSearchHistory();
