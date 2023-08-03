  var theMonth = dayjs().format('dddd, MMM');
  var theDay = dayjs().format('D');
  var theYear = dayjs().format('YYYY');

$(function () {
  var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
  var searchBtn = document.getElementById("searchbtn");

  var cityInput = document.getElementById('city');
  var cityDisplay = document.getElementById('city-display');
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
    
    var parsedCities = JSON.parse(window.localStorage.getItem('search'));
    console.log(parsedCities);
    //if there arent any parsed cities user hasnt stored anything in local storage so we want to add their first city to local storage 
    if (!parsedCities){
        var searchedCities = [city];
        localStorage.setItem('search', JSON.stringify(searchedCities));
        console.log(parsedCities, 'if parsedCities doesnt exist');
    } else {
      //if there are parsed cities user has been here previously and we want to add those parsed cities to the array
        parsedCities.push(city);
        console.log(parsedCities, 'after it is pushed to array');
        localStorage.setItem('search', JSON.stringify(parsedCities));
    } 

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
    console.log(searchHist, 'search history');
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

        //identify element
        tempEl = document.getElementById('temp');
        humidEl = document.getElementById('humid');
        windEl = document.getElementById('wind');
        dateEl = document.getElementById('date');
        iconEl = document.getElementById('icon');

        // Give it content
        tempEl.textContent = `Temp: ${data.list[0].main.temp}F`;
        humidEl.textContent = `Humidity: ${data.list[0].main.humidity}%`;
        windEl.textContent = `Wind Speed: ${data.list[0].wind.speed}mph`;
        dateEl.textContent = `${theMonth} ${theDay}${nth(theDay)} ${theYear}`;
        // Add any attributes


        //for next 5 days the next day at 6am is 8, 16, 24, 32, 39?
      });
  }

  function nth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }}

  searchBtn.addEventListener("click", search);

  //displays search history retreived from local storage when page is loaded 
  previousSearchHistory();
});


