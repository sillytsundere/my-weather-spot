var theMonth = dayjs().format("dddd, MMM");
var theDay = dayjs().format("D");
var theYear = dayjs().format("YYYY");
var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
var searchBtn = document.getElementById("searchbtn");
var cityInput = document.getElementById("city");
var cityDisplay = document.getElementById("city-display");
var displaySearches = document.getElementById("search-history");

$(function () {


  function search(event) {
    //prevents reload of page on search submission
    event.preventDefault();
    //grabs user search input and assigns it to 'city' variable
    var city = cityInput.value;
    //alerts user to enter a city name if search is submitted empty
    if (city === "") {
      alert("You must enter a city");
      return;
    }

    var parsedCities = JSON.parse(window.localStorage.getItem("search"));
    console.log(parsedCities);
    //if there arent any parsed cities user hasnt stored anything in local storage so we want to add their first city to local storage
    if (!parsedCities) {
      var searchedCities = [city];
      localStorage.setItem("search", JSON.stringify(searchedCities));
      console.log(parsedCities, "if parsedCities doesnt exist");
    } else {
      //if there are parsed cities user has been here previously and we want to add those parsed cities to the array
      parsedCities.push(city);
      console.log(parsedCities, "after it is pushed to array");
      localStorage.setItem("search", JSON.stringify(parsedCities));
    }

    var historyItem = document.createElement("button");
    historyItem.setAttribute("class", "btn btn-primary");
    historyItem.textContent = city;
    displaySearches.append(historyItem);
    getWeather(city);
    // historyItem.addEventListener('click', getWeather(this));
    //above line seems to be wrong

    //clears search text box when search is submitted
    cityInput.value = "";
  }


  //this function displays the search history saved in local storage on the page upon page upload as it is called at the bottom of the code
  function previousSearches() {
    var searchHist = JSON.parse(localStorage.getItem("search"));
    console.log(searchHist, "search history");
    if (searchHist) {
      searchHist.forEach((city) => {
        var historyItem = document.createElement("button");
        historyItem.setAttribute("class", "btn btn-primary");
        historyItem.textContent = city;
        displaySearches.append(historyItem);
        //historyItem.addEventListener('click', getWeather(this));
        //above line seems to be wrong
        //historyItem.addEventListener('click', getWeather(historyItem.textContent));
      });
    }
  }


  function getWeather(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    
    fetch(apiURL)
      .then(function (res) {
        return res.json();
      })
      .then((data) => {
        console.log(data, "the data object");

        // document.getElementById('weather-display').innerHTML = "";

        cityDisplay.textContent = city;

        //identify element
        tempEl = document.getElementById("temp");
        humidEl = document.getElementById("humid");
        windEl = document.getElementById("wind");
        dateEl = document.getElementById("date");
        iconEl = document.getElementById("icon");

        // Give it content
        tempItem = Math.trunc(data.list[0].main.temp);
        tempEl.textContent = `Temp: ${tempItem}F`;
        humidEl.textContent = `Humidity: ${data.list[0].main.humidity}%`;
        windEl.textContent = `Wind Speed: ${Math.round(data.list[0].wind.speed * 10) / 10}mph`;
        dateEl.textContent = `${theMonth} ${theDay}${nth(theDay)} ${theYear}`;
        iconEl.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`);
        // Add any attributes

        //for next 5 days the next day at 6am is 8, 16, 24, 32, 39?
        document.getElementById("five-day").innerHTML = "";
        for (let i = 7; i < 40; i += 8) {
          let card = document.createElement("div");
          card.classList.add("col", "card");
          let cardBody = document.createElement("div");
          cardBody.setAttribute("class", "card-body");
          let date = document.createElement("h5");
          let smIcon = document.createElement("img");
          let wind = document.createElement("p");
          let temp = document.createElement("p");
          let humidity = document.createElement("p");

          //create elements
          //assign content
          let iconCode = data.list[i].weather[0].icon;
          smIcon.setAttribute("src", `https://openweathermap.org/img/wn/${iconCode}.png`);
          wind.textContent = `Wind Speed: ${Math.round(data.list[i].wind.speed * 10) / 10}mph`;
          temp.textContent = `Temp: ${Math.trunc(data.list[i].main.temp)}F`;
          humidity.textContent = `Humidity: ${data.list[i].main.humidity}%`;

          let dateText = data.list[i].dt_txt;
          dateText = dateText.split(" ")[0].split("-");
          let day = `${dateText[1]}/${dateText[2]}/${dateText[0]}`;
          date.textContent = day;

          //add to html 'five-day' element
          document.getElementById("five-day").append(card);
          card.append(cardBody);
          cardBody.append(date, smIcon, temp, humidity, wind);
        }
      });
  }


  function nth(d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }


  searchBtn.addEventListener("click", search);

  //displays search history retreived from local storage when page is loaded
  previousSearches();
});
