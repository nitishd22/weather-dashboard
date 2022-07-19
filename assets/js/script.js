var cities = [];
var citySearch=document.querySelector("#city-search");
var cityInput=document.querySelector("#city");
var weather=document.querySelector("#current-weather");
var searchedCity = document.querySelector("#searched-city");
var forecastName = document.querySelector("#forecast");
var fc5day = document.querySelector("#fiveday-container");
var pastBtn = document.querySelector("#past-search-buttons");

var submitForm = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getWeather(city);
        fivedayFC(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Enter a City: ");
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getWeather = function(city){
    var apiKey = "834f5f2c8ff24d853fad28aa51c1dbb7"
    var apiURL = `https://api.openweathermap.org/data/3.0/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showWeather(data, city);
        });
    });
};

var showWeather = function(weather, searchCity){
   weather.textContent= "";  
   searchedCity.textContent=searchCity;

   var date = document.createElement("span")
   date.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   searchedCity.appendChild(date);

   var tempIcon = document.createElement("img")
   tempIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   searchedCity.appendChild(tempIcon);

   var temperature = document.createElement("span");
   temperature.textContent = "Temperature: " + weather.main.temp + " °F";
   temperature.classList = "list-group-item"

   var humidity = document.createElement("span");
   humidity.textContent = "Humidity: " + weather.main.humidity + " %";
   humidity.classList = "list-group-item"

   var windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeed.classList = "list-group-item"
   weather.appendChild(temperature);
   weather.appendChild(humidity);
   weather.appendChild(windSpeed);
   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUV(lat,lon)
}

var getUV = function(lat,lon){
    var apiKey = "834f5f2c8ff24d853fad28aa51c1dbb7"
    var apiURL = `https://api.openweathermap.org/data/3.0/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showUV(data)
        });
    });
}
 
var showUV = function(index){
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"

    uvIndexVal = document.createElement("span")
    uvIndexVal.textContent = index.value

    if (index.value <=2){
        uvIndexVal.classList = "favorable"
    }else if (index.value >2 && index.value<=8){
        uvIndexVal.classList = "moderate "
    }
    else if (index.value >8){
        uvIndexVal.classList = "severe"
    };

    uvIndex.appendChild(uvIndexVal);
    weather.appendChild(uvIndex);
}

var fivedayFC = function(city){
    var apiKey = "834f5f2c8ff24d853fad28aa51c1dbb7"
    var apiURL = `https://api.openweathermap.org/data/3.0/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           showFiveDay(data);
        });
    });
};

var showFiveDay = function(weather){
    fc5day.textContent = ""
    forecastName.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
       
       var forecastElement=document.createElement("div");
       forecastElement.classList = "card bg-primary text-light m-2";

       var fcDate = document.createElement("h5")
       fcDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       fcDate.classList = "card-header text-center"
       forecastElement.appendChild(fcDate);

       var tempIcon = document.createElement("img")
       tempIcon.classList = "card-body text-center";
       tempIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastElement.appendChild(tempIcon);
    
       var forecastTemp=document.createElement("span");
       forecastTemp.classList = "card-body text-center";
       forecastTemp.textContent = dailyForecast.main.temp + " °F";
        forecastElement.appendChild(forecastTemp);

       var forecastHum=document.createElement("span");
       forecastHum.classList = "card-body text-center";
       forecastHum.textContent = dailyForecast.main.humidity + "  %";
       forecastElement.appendChild(forecastHum);
        fc5day.appendChild(forecastElement);
    }

}

var pastSearch = function(pastSearch){
    pastSearchElement = document.createElement("button");
    pastSearchElement.textContent = pastSearch;
    pastSearchElement.classList = "d-flex w-100 btn-light border p-2";
    pastSearchElement.setAttribute("data-city",pastSearch)
    pastSearchElement.setAttribute("type", "submit");
    pastBtn.prepend(pastSearchElement);
}

var pastSearches = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getWeather(city);
        fivedayFC(city);
    }
}

citySearch.addEventListener("submit", submitForm);
pastBtn.addEventListener("click", pastSearches);