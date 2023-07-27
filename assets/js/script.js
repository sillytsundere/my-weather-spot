$(function () {
  var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
  var searchBtn = document.getElementById("searchbtn");
//   var city = "Austin"

  var cityInput = document.getElementById('city');
  var cityDisplay = document.getElementById('city-display');
  var weatherDisplay = document.getElementById('weather-display');
  var displaySearches = document.getElementById('search-history');

  var starterIcon = 'kjfhlkajfbk'
  var starterIcon = `https://openweathermap.org/img/wn/${starterIcon}.png`
  
  function search(event) {
    event.preventDefault();
    var city = cityInput.value;
    if (city === '') {
        alert('You must enter a city');
        return
    }

    //localStorage.setItem('search', city);
    var cities = window.localStorage.getItem('search');
    
    var parsedCities = JSON.parse(cities);
    console.log(parsedCities);
    //if there arent any parsed cities user hasnt stored anything in local storage so we wat to add their first city to local storage but if there are parsed cities user has been here previously and we want to add those parsed cities to the array
    if (!parsedCities){
        var searchedCities = [city];
        // searchedCities.push(newCity);
        localStorage.setItem('search', JSON.stringify(searchedCities));
    } else {
        parsedCities.push(city);
        console.log(parsedCities, 'pushed to array');
        localStorage.setItem('search', JSON.stringify(parsedCities));
    } 
    // console.log(parsedCities, 'after push to array');

    getWeather(city);
    showCities(); //reprinting because it is printing the whole array every time button is clicked-need to fix that
    cityInput.value = '';
  }

  function showCities() {
    var allCities = JSON.parse(localStorage.getItem('search'));
    console.log(allCities);

    for (var i = 0; i < allCities.length; i++) {
        var history = document.createElement('li');
        history.textContent = allCities[i];
        displaySearches.appendChild(history);
        
    }
}
  //this function displays the search history saved in local storage on the page upon page upload as it is called at the bottom of the code
  function addToSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('search'));
    console.log(searchHistory);
    if (searchHistory) {
      searchHistory.forEach(city => {
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
        // console.log(data);
        // console.log(data.list[0].main.temp);
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

  
  addToSearchHistory();
});


