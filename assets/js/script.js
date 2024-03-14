var theMonth = dayjs().format("dddd, MMM");
var theDay = dayjs().format("D");
var theYear = dayjs().format("YYYY");
var apiKey = "714201ec7c0eacaa109850c8fe5f66dd";
var searchBtn = document.getElementById("searchbtn");
var cityInput = document.getElementById("city");
var unitRadioButtons = document.querySelectorAll('input[name="unitOptions"]');
var weatherDisplay = document.getElementById("weather-display");
var cityDisplay = document.getElementById("city-display");
var displaySearches = document.getElementById("search-history");

$(function () {
  $("body").css(
    "background",
    "linear-gradient(to top, #FFC371 0%, #09203F 85%)"
  );

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

    // identify input that indicates user's chosen units
    var unitsInput = document.querySelector('input[name="unitOptions"]:checked');
    if (!unitsInput) {
      //check if a radio has been selected, if not alert user, prompting them to choose one
      alert("Please select units");
      return;
    }
    var selectedUnits = unitsInput.value;

    // retreive the search history from local storage
    var parsedCities = JSON.parse(window.localStorage.getItem("search"));

    // check if the city with the same units already exists in the search history
    var cityExists = parsedCities && parsedCities.some(cityObj => cityObj.city === city && cityObj.units === selectedUnits)

    if (cityExists) {
      alert("This city with the same units already exists in the search history.");
      searchBtn.blur();
      //var unitRadioButtons = document.querySelectorAll('input[name="unitOptions"]');
      // unitRadioButtons.forEach(function(radioButton) {
      // radioButton.checked = false;
      // });
      $('input[name="unitOptions"]').prop("checked", false);
      cityInput.value = "";
      return;
    }

    //if there arent any parsed cities user hasnt stored anything in local storage so we want to add their first city to local storage
    if (!parsedCities) {
      var searchedCities = [{ city: city, units: selectedUnits }];
      localStorage.setItem("search", JSON.stringify(searchedCities));
    } else {
      //if there are parsed cities user has been here previously and we want to add those parsed cities to the array
      parsedCities.push({ city: city, units: selectedUnits });
      localStorage.setItem("search", JSON.stringify(parsedCities));
    }
    //creates and displays searched cities as button elements and appends them to search history div element
    var historyItem = document.createElement("button");
    historyItem.setAttribute("class", "btn btn-dark");
    historyItem.textContent = `${city}(\u00B0${selectedUnits === 'imperial' ? 'F' : 'C'})`;
    displaySearches.append(historyItem);
    getWeather(city, selectedUnits);

    // clears search text box when search is submitted
    cityInput.value = "";
    // Clear unit radio buttons
    //var unitRadioButtons = document.querySelectorAll('input[name="unitOptions"]');
    unitRadioButtons.forEach(function(radioButton) {
      radioButton.checked = false;
    });
    // Unfocus the search button after search is made
    searchBtn.blur();
  }

  //this function displays the search history saved in local storage upon page upload as it is called at the bottom of the code
  //it creates and displays cities saved in local storage as button elements and appends them to search-history div element upon page load
  function previousSearches() {
    var searchHist = JSON.parse(localStorage.getItem("search"));
    if (searchHist) {
      searchHist.forEach((searchItem) => {
        // var historyItem = document.createElement("button");
        // historyItem.setAttribute("class", "btn btn-dark");
        // historyItem.setAttribute("value", searchItem.city);
        // historyItem.textContent = `${searchItem.city}(\u00B0${searchItem.units === 'imperial' ? 'F' : 'C'})`;
        // displaySearches.append(historyItem);

        var historyItem = $("<button>").addClass("btn btn-dark").val(searchItem.city).text(`${searchItem.city}(\u00B0${searchItem.units === 'imperial' ? 'F' : 'C'})`);
        $("#search-history").append(historyItem);
      });
    }
  }

  function getWeather(city, selectedUnits) {
    
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${selectedUnits}&appid=${apiKey}`;

    fetch(apiURL)
      .then(function (res) {
        return res.json();
      })
      .then((data) => {
        console.log(data, "the data object");

        // document.getElementById('weather-display').innerHTML = "";
        //potential to refactor this section to create elements dynamically instead of editing empty html elements
        cityDisplay.textContent = city;

        //identify element
        tempEl = document.getElementById("temp");
        humidEl = document.getElementById("humid");
        windEl = document.getElementById("wind");
        dateEl = document.getElementById("date");
        iconEl = document.getElementById("icon");

        // Give it content
        tempItem = Math.trunc(data.list[0].main.temp);
        tempEl.textContent = `Temp: ${tempItem}\u00B0${selectedUnits === 'imperial' ? 'F' : 'C'}`;
        humidEl.textContent = `Humidity: ${data.list[0].main.humidity}%`;
        windEl.textContent = `Wind Speed: ${
          Math.round(data.list[0].wind.speed * 10) / 10
        } ${selectedUnits === 'imperial' ? 'mph' : 'km/h'}`;
        dateEl.textContent = `${theMonth} ${theDay}${nth(theDay)} ${theYear}`;

        // Add icon src attribute
        iconEl.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`
        );

        //for loop to generate and display future weather conditions for next 5 days
        document.getElementById("five-day").innerHTML = "";
        for (let i = 7; i < 40; i += 8) {
          //create elements
          let card = document.createElement("div");
          card.classList.add(
            "col",
            "card",
            "m-1",
            "border-2",
            "rounded-3",
            "border-white"
          );
          // Add the 'show' class to trigger the slide-in effect
          card.setAttribute(
            "style",
            "background-color: rgba(255, 255, 255, 0); "
          );
          let cardBody = document.createElement("div");
          cardBody.setAttribute("class", "card-body");
          let date = document.createElement("h3");
          let smIcon = document.createElement("img");
          let wind = document.createElement("p");
          let temp = document.createElement("p");
          let humidity = document.createElement("p");

          //assign content
          let iconCode = data.list[i].weather[0].icon;
          smIcon.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${iconCode}.png`
          );
          wind.textContent = `Wind Speed: ${
            Math.round(data.list[i].wind.speed * 10) / 10
          } ${selectedUnits === 'imperial' ? 'mph' : 'km/h'}`;
          temp.textContent = `Temp: ${Math.trunc(
            data.list[i].main.temp
          )}\u00B0${selectedUnits === 'imperial' ? 'F' : 'C'}`;
          humidity.textContent = `Humidity: ${data.list[i].main.humidity}%`;
          let dateText = data.list[i].dt_txt;
          dateText = dateText.split(" ")[0].split("-");
          let day = `${dateText[1]}/${dateText[2]}/${dateText[0]}`;
          date.textContent = day;

          //add to html 'five-day' element
          document.getElementById("five-day").append(card);
          // trigger slide-in effect after a short delay
          setTimeout(() => {
            card.classList.add("show");
          }, 100 * i); // adjust the delay as needed
          card.append(cardBody);
          cardBody.append(date, smIcon, temp, humidity, wind);
        }
      });
  }

  function nth(d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  //event listener for search history buttons, uses event bubbling to target the button elements in the display searches element
  displaySearches.addEventListener("click", function (e) {
    //only alert for elements that have a "btn" class
    if (e.target.classList.contains("btn")) {
      // Get the text content of the clicked button (city name)
      var cityName = e.target.value;

      // Retrieve the search history from local storage
      var searchHist = JSON.parse(localStorage.getItem("search"));
      // Find the search item with the matching city name
      var searchItem = searchHist.find(item => item.city === cityName);

      // Check if the search item is found
      if (searchItem) {
        // Get the city and units from the search item
        var city = searchItem.city;
        var units = searchItem.units;

        // Call getWeather with the city and units
        getWeather(city, units);
      } else {
        alert("Could not locate city in local storage.")
      }
      // unfocus button after it is clicked
      e.target.blur();
    }
  });

  //event listener to initiate search which calls get weather function to enact main functionality of web app
  searchBtn.addEventListener("click", search);

  //displays search history retreived from local storage when page is loaded
  previousSearches();
});
