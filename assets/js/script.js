$(function () {
  var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
  var searchBtn = document.getElementById("searchbtn");

  var cityInput = document.getElementById('city');
  var cityDisplay = document.getElementById('city-display');
  var weatherDisplay = document.getElementById('weather-display');
  var displaySearches = document.getElementById('search-history');

  //code to use for starter icon later
  // var starterIcon = 'kjfhlkajfbk'
  // var starterIcon = `https://openweathermap.org/img/wn/${starterIcon}.png`
  
  function search(event) {
    //prevents reload of page on search submission
    event.preventDefault();
    //grabs user search input and assigns it to 'city' variable
    var city = cityInput.value;
    //alerts user to enter a city name if search is submitted empty
    if (city === '') {
        alert('You must enter a city');
        return
    }

    var cities = window.localStorage.getItem('search');
    console.log(cities, 'cities');
    
    var parsedCities = JSON.parse(cities);
    console.log(parsedCities);
    //if there arent any parsed cities user hasnt stored anything in local storage so we wat to add their first city to local storage but if there are parsed cities user has been here previously and we want to add those parsed cities to the array
    if (!parsedCities){
        var searchedCities = [city];
        // searchedCities.push(newCity);
        localStorage.setItem('search', JSON.stringify(searchedCities));
    } else {
        parsedCities.push(city);
        console.log(parsedCities, 'after it is pushed to array');
        localStorage.setItem('search', JSON.stringify(parsedCities));
    } 
    // console.log(parsedCities, 'after push to array');
    var historyList = document.createElement('li');
        historyList.textContent = city;
        displaySearches.append(historyList);
    getWeather(city);

    //clears search text box when search is submitted
    cityInput.value = '';
  }

  //this function displays the search history saved in local storage on the page upon page upload as it is called at the bottom of the code
  function previousSearchHistory() {
    var searchHist = JSON.parse(localStorage.getItem('search'));
    console.log(searchHist);
    if (searchHist) {
      searchHist.forEach(city => {
        var historyList = document.createElement('li');
        historyList.textContent = city;
        displaySearches.append(historyList);
      })
    }
    }

  function getWeather(city) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;
    //temperate literal syntax
    // var urlTemp = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    fetch(apiURL)
      .then(function (res) {
        return res.json();
      })
      .then((data) => {
        console.log(data, 'the data object');
        console.log(data.list[0].main.temp, 'the temp');
        cityDisplay.textContent = city;

        // Create Element
        var tempEl = document.createElement('p');

        // Give it content
        tempEl.textContent = `Temp: ${data.list[0].main.temp}F`;
        // Add any attributes

        //Append to the page
        weatherDisplay.append(tempEl);
        //Make previous current weather card disappear

      });
  }

  searchBtn.addEventListener("click", search);

  //displays search history retreived from local storage when page is loaded 
  previousSearchHistory();
});


