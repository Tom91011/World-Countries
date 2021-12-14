
const regionFilterEl =  document.getElementById("dropdown-menu")
const continentsList = document.getElementById("continents")
const countriesContainerEl = document.getElementById("countries-container");
const countrySearch = document.getElementById("search-box")
// variables for extra country information element
const countryExtraInfoEl = document.querySelector("#extra-info-container")
const extraInfoCloseBtn = document.querySelector("#extra-info-container #close")
const countryName = document.getElementById("country-name")
const countryPopulation = document.getElementById("country-population")
const countryRegion = document.getElementById("country-region")
const countryCapital = document.getElementById("country-capital")
const countryFlag = document.getElementById("country-flag")
const borders = document.getElementById("borders")
const languages = document.getElementById("languages")
const area = document.getElementById("country-area")
const temp = document.getElementById("country-temp")
const weatherDisc = document.getElementById("weather-description")
const weatherIcon = document.getElementById("weather-icon")
const conversionRateEl = document.getElementById("conversion-rate")
const inverseRateEl = document.getElementById("inverse-rate")

// populating the HTML for all countries - not using as page loads too slowly
// for (let i = 0; i<250; i++) {
// countriesEl.innerHTML += `
//     <div class="countries">
//       <div class="flag">
//       </div>
//       <div class="country-info">
//         <div class="country-name">
//           <p class="country"></p>
//         </div>
//         <div class="population specific-details">
//         </div>
//         <div class="region specific-details">
//         </div>
//         <div class="capital specific-details">
//         </div>
//       </div>
//     </div>`
// }

//variables for the country's elements
const countryNameArray = document.querySelectorAll(".country")
const populationArray = document.querySelectorAll(".population")
const regionArray = document.querySelectorAll(".region")
const capitalArray = document.querySelectorAll(".capital")
const flagImgAray = document.querySelectorAll(".flag-img")
const countriesArray = document.querySelectorAll(".countries")

let countriesData = [] // will contain the fetched data once complete

// fetching country info from an API and populating in the newly created html
fetch('https://restcountries.eu/rest/v2/all')
  .then(response => response.json())
  .then(countriesList => {
      countriesData = countriesList //saves the fetched JSON data in a variable
      for (let i = 0; i<countriesList.length; i++) {
      countriesArray[i].setAttribute("data", countriesList[i].alpha2Code)
      countryNameArray[i].innerHTML = countriesList[i].name;
      populationArray[i].innerHTML =
            `<p>
              Population: <span class="result">${countriesList[i].population.toLocaleString()}</span>
            </p>`
      regionArray[i].innerHTML =
            `<p>Region: <span class="result region-result">${countriesList[i].region}</span></p>`
      capitalArray[i].innerHTML =
            `<p>
              Capital: <span class="result">${countriesList[i].capital}</span>
            </p>`
      // flagImgAray[i].innerHTML = `<img src=${countriesList[i].flag} alt="">`
      flagImgAray[i].innerHTML = `<img src="https://raw.githubusercontent.com/Tom91011/World-Countries/fba0953ca1d0e3ce9f2c9a057c8ddee85a334642/flags/4x3/${countriesList[i].alpha2Code}.svg">`.toLowerCase();
      }
    }
  )

regionFilterEl.addEventListener("click", function() {dropdownMenu()})

const dropdownMenu = () => continentsList.classList.toggle("hidden")

//function for generating the string from the filter
countrySearch.addEventListener("input", function() {
  for (let j = 0; j<countryNameArray.length; j++) {
    if (countryNameArray[j].innerHTML.toLowerCase().search(countrySearch.value.toLowerCase()) === -1) {
        countriesArray[j].classList.add("hidden")
    } else {
        countriesArray[j].classList.remove("hidden")
    }
  }
})

//Regional filter function
const continentsEl = document.getElementById("continents");
continentsEl.addEventListener("click", regionFilter, false);

function regionFilter(e) {
  if (e.target !== e.currentTarget) {
      for (let k = 0; k < countryNameArray.length; k++) {
        if(e.target.innerHTML === "All Countries") {
          countriesArray[k].classList.remove("hidden")
        }
        else if (`region: ${e.target.innerHTML.toLowerCase()}` != regionArray[k].textContent.toLowerCase()) {
          countriesArray[k].classList.add("hidden")
        } else {
          countriesArray[k].classList.remove("hidden")
        }
      }
  e.stopPropagation();
  continentsList.classList.add("hidden")
  }
}

//Extra Country information, identifies when a user hovers over a country and displays a "extra info window"
countriesContainerEl.addEventListener("mouseover", mOver, false)
countriesContainerEl.addEventListener("mouseout", mOut, false)

function mOver(e) {
  let selectedCountry = e.target.closest(".countries")
  if(selectedCountry) {
    selectedCountry.children[0].style.display = "block"
  }
}

function mOut(e) {
  let selectedCountry = e.target.closest(".countries")
  if(selectedCountry) {
    selectedCountry.children[0].style.display = "none"
  }
}

// A new window pops up when a user clicks on a country

const countryClicked = (e) => {
  let selectedCountryEl = e.target.closest(".countries")
  let selectedCountryName = selectedCountryEl.children[2].children[0].textContent
  let selectedCountrypopulation = selectedCountryEl.children[2].children[1].textContent
  let selectedCountryRegion = selectedCountryEl.children[2].children[2].textContent
  let selectedCountryCapital = selectedCountryEl.children[2].children[3].textContent
  let selectedCountryFlag = selectedCountryEl.children[1].children[0].src
  let countryAlphaCode = selectedCountryEl.getAttribute("data")
// returns the index of the country clicked, it utilises the countryAlphaCode stored as a data attribute
  let countryIndex
  for (i = 0; i < countriesData.length; i++) {
    if (countriesData[i].alpha2Code === countryAlphaCode) {
      if (countriesData[i].borders.length === 0) {
        borders.innerHTML = "Border countries: This country has no borders with another country"
      } else {
        borders.innerHTML = `Border countries: ${countriesData[i].borders}`
      }
    currentIndex = i
    }
  }
  countryName.innerHTML = selectedCountryName
  countryPopulation.innerHTML = selectedCountrypopulation
  countryRegion.innerHTML = selectedCountryRegion
  countryCapital.innerHTML = selectedCountryCapital
  countryFlag.innerHTML = `<img src=${selectedCountryFlag}>`
  languages.innerHTML = `Languages: ${getLanguages(currentIndex)}`
  area.innerHTML = `Area: ${countriesData[currentIndex].area.toLocaleString()}km`
  getWeather(countriesData[currentIndex].latlng[0], countriesData[currentIndex].latlng[1]);
  getExRate(countriesData[currentIndex].currencies[0].code, countriesData[currentIndex].currencies[0].symbol)
  countryExtraInfoEl.style.display = "flex"
  countriesContainerEl.style.filter = "blur(32px)"
}

countriesContainerEl.addEventListener("click", countryClicked, false)

// closes the extra info window
const closeExtraInfo = () => {
  countryExtraInfoEl.style.display = "none"
  weatherIcon.innerHTML = ""
  temp.innerHTML = ""
  weatherDisc.innerHTML = ""
  countriesContainerEl.style.filter = "none"
}
countryExtraInfoEl.addEventListener("click", closeExtraInfo);

const getLanguages = (country) => {
  let languages = ""
  for (i = 0; i < countriesData[country].languages.length; i++) {
    if(i === 0) {
      languages = `${(countriesData[country].languages[i].name)}`
    } else {
    languages += `, ${(countriesData[country].languages[i].name)}`;
    }
  }
  return languages
}

const getWeather = (lat, lon) => {
  let apiKey = "12d38d918b6cc5a4f62683ab43c251b9"
  let fetchURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKey}`
  fetch(fetchURL)
    .then(response => response.json())
    .then(weatherData =>   {
      temp.innerHTML = `${weatherData.main.temp} °C `
      weatherDisc.innerHTML = weatherData.weather[0].description
      getWeatherIcon(weatherData.weather[0].icon)
      }
    )
}

const getWeatherIcon = (icon) => {
    let iconImage = `http://openweathermap.org/img/wn/${icon}@2x.png`
    weatherIcon.innerHTML = `<img src="${iconImage}">`
  }

const getExRate = (code, symbol) => {
  const apiKey  = "02c31b8c5114bdc10418947a"
  let fetchURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  fetch (fetchURL)
    .then (response => response.json())
    .then(currencyData => {
      const allRates = currencyData.conversion_rates;
      let allRatesSymbolArray = []
      let allRatesRateArray = []
      for (const [key,value] of Object.entries(allRates)) {
          allRatesSymbolArray.push(key);
          allRatesRateArray.push(value)
      }
      // console.log(allRatesArray);
      findExRate(allRatesSymbolArray, allRatesRateArray, code)
    }
  )
}

const findExRate = (allRatesSymbolArray, allRatesRateArray, code) => {

for (i = 0; i< allRatesSymbolArray.length; i++) {
  if   (allRatesSymbolArray[i] === code) {
      conversionRateEl.innerHTML = `1USD = ${allRatesRateArray[i]} ${allRatesSymbolArray[i]}`
      let inverseRate = (1/allRatesRateArray[i])
      inverseRateEl.innerHTML = `1 ${allRatesSymbolArray[i]} = ${inverseRate} USD`
      console.log(inverseRate);
    }
  }
}








//
