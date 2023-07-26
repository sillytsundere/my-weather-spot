$(function () {
  var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
  var searchBtn = document.getElementById("searchbtn");
//   var city = "Austin"

  var cityInput = document.getElementById('city');
  var cityDisplay = document.getElementById('city-display');
  var weatherDisplay = document.getElementById('weather-display');

  var starterIcon = 'kjfhlkajfbk'
  var starterIcon = `https://openweathermap.org/img/wn/${starterIcon}.png`
  
  function search(event) {
    event.preventDefault();
    var city = cityInput.value;
    if (city === '') {
        alert('You must enter a city');
        return
    }
    getWeather(city);
    cityInput.value = '';
  }

  function getWeather(city) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;
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



      });
  }

 

  searchBtn.addEventListener("click", search);


});


