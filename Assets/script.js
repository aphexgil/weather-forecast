const key = '37dc5cb97cecc77ea9e04e3af68fc80b';
let weatherInfo;
let pastSearches = localStorage.getItem("pastSearches");

function saveSearch(city){
    if(pastSearches==null){

    }
}

async function getWeather(city){

    let geoCodingURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + "&appid=" + key;
    let cityInfo;
    await fetch(geoCodingURL)
        .then((resp) => resp.json())
        .then( function(data) {
            cityInfo = data;
        });
    
    let weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityInfo[0].lat + '&lon=' + cityInfo[0].lon + "&appid=" + key;
    await fetch(weatherURL)
        .then((resp) => resp.json())
        .then( function(data) {
            weatherInfo = data;
        });
}

function displayWeather(){
    return;
}

function displaySearches(){
    if(pastSearches==null){
        return;
    }
    for(var i=0; i<pastSearches.length; i++){
        $('.search-col').append
    }
}

$('.search-button').on("click", function (event){
    event.preventDefault();
    let city = $('.city-input').val();
    saveSearch(city);
    getWeather(city);
    displayWeather();
});
