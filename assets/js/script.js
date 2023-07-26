$(function () {
  var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
  var searchBtn = document.getElementById("searchbtn");
//   var city = "Austin"

  var cityInput = document.getElementById('city');
  var cityDisplay = document.getElementById('city-display');
  var weatherDisplay = document.getElementById('weather-display');
  var searchHistory = [];
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
    console.log(parsedCities, 'before push to array');
    var newCity = {
        searched: city};    
    if (!parsedCities){
        var searchedCities = {
            cities: []
        }
        searchedCities.cities.push(newCity);
        localStorage.setItem('search', JSON.stringify(searchedCities));
    } else {
        parsedCities.cities.push(newCity);
        localStorage.setItem('search', JSON.stringify(parsedCities));
    } 
    console.log(parsedCities, 'after push to array');

    getWeather(city);
    showCities(); //reprinting because it is printing the whole array every time button is clicked-need to fix that
    cityInput.value = '';
  }

  function showCities() {
    var allCities = JSON.parse(localStorage.getItem('search'));
    console.log(allCities);

    for (var i = 0; i < allCities.cities.length; i++) {
        var history = document.createElement('li');
        history.textContent = allCities.cities[i].searched;
        displaySearches.appendChild(history);
    }
}

//   function addToSearchHistory() {
    
//     if (cityInput === '') {
//         return;
//     }
//   }

  function getWeather(city) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;
    //temperate literal syntax
    // var urlTemp = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    fetch(apiURL)
      .then(function (res) {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.list[0].main.temp);
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


});


