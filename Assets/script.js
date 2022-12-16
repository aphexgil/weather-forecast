const key = '37dc5cb97cecc77ea9e04e3af68fc80b';
let weatherInfo;
let pastSearches = JSON.parse(localStorage.getItem("pastSearches"));

function saveSearch(city){
    if(pastSearches==null){
        pastSearches = [];
    }
    let beenSearched = false;
    for(var i=0; i<pastSearches.length; i++){
        if(pastSearches[i].toUpperCase() == city.toUpperCase()){
            beenSearched = true;
        }
    }
    if(!beenSearched){
        pastSearches.push(city);
        localStorage.setItem("pastSearches",JSON.stringify(pastSearches));
    }
    displaySearches();
}

async function getWeather(city){

    let geoCodingURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + "&appid=" + key;
    let cityInfo;
    await fetch(geoCodingURL)
        .then((resp) => resp.json())
        .then( function(data) {
            cityInfo = data;
        })
        .catch( (error) => {
            console.log('error');
        });
    let weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityInfo[0].lat + '&lon=' + cityInfo[0].lon + "&appid=" + key;
    await fetch(weatherURL)
        .then((resp) => resp.json())
        .then( function(data) {
            weatherInfo = data;
            displayWeather();
        })
}

function displayWeather(){

    $('.spacer').remove();
    $('.big-col').remove();

    var bigCol = $('<div/>',{
        class: 'col-9 big-col',
    });

    var topRow = $('<div/>',{
        class: 'row'
    });
    
    var todayBox = $('<div/>',{
        class: 'col-12 border border-dark'
    });
    $(todayBox).attr('style', 'padding: 7px 0px 0px 5px;')

    var todayBoxHeadline = $('<h2/>');

    var date = weatherInfo.list[0].dt_txt.split(" ")[0].split("-");
    date.push(date.shift());
    date = date.join("/");
    $(todayBoxHeadline).text(`${weatherInfo.city.name} (${date})`);
    $(todayBoxHeadline).attr('style', 'display: inline-block');
    $(todayBox).append(todayBoxHeadline);

    var iconURL = "https://openweathermap.org/img/wn/" + weatherInfo.list[0].weather[0].icon + ".png";
    var todayBoxIcon = $('<img/>');
    $(todayBoxIcon).attr('src', iconURL);
    $(todayBoxIcon).attr('style', 'width: 40px');
    $(todayBox).append(todayBoxIcon);

    var todayBoxConditions = $('<ul/>');
    $(todayBoxConditions).attr('style', 'padding: 0; list-style-type: none');

    var todayTemp = $('<li/>');
    $(todayTemp).text('Temp: ' + Math.floor((parseInt(weatherInfo.list[0].main.temp)-273.15)*9/5+32) + "˚F");
    $(todayBoxConditions).append(todayTemp);

    var todayWind = $('<li/>');
    $(todayWind).text('Wind: ' + weatherInfo.list[0].wind.speed+ " MPH");
    $(todayBoxConditions).append(todayWind);

    var todayHumidity = $('<li/>');
    $(todayHumidity).text('Humidity: ' + weatherInfo.list[0].main.humidity+ "%");
    $(todayBoxConditions).append(todayHumidity);

    $(todayBox).append(todayBoxConditions);

    $(topRow).append(todayBox);
    
    $(bigCol).append(topRow);

    var midRow = $('<div/>',{
        class: 'row'
    });
    $(midRow).attr('style', 'margin-top: 5px; padding: 0px;');

    var midCol = $('<div/>',{
        class: 'col-12'
    });
    $(midCol).attr('style', 'padding: inherit;');

    var midText = $('<h3/>');
    $(midText).attr('style', 'padding: inherit;');

    $(midCol).append(midText);
    $(midRow).append(midCol);

    $(bigCol).append(midRow);

    var btmRow = $('<div/>',{
        class: 'row'
    });

    var blankDay = 0;
    var offset = 8;
    while(offset<40){
        blankDay++;
        var dayBox = $('<div>', {
            class: 'col'
        });

        var dayBoxHeadline = $('<h3/>');

        var thisDate = weatherInfo.list[offset].dt_txt.split(" ")[0].split("-");
        thisDate.push(thisDate.shift());
        thisDate = thisDate.join("/");
        $(dayBoxHeadline).text(thisDate);
        $(dayBox).append(dayBoxHeadline);
        $(dayBox).attr('style', 'margin: 0px 10px 0px 10px; background: #323d4f; color: white; padding: 5px;');

        var thisIconURL = "https://openweathermap.org/img/wn/" + weatherInfo.list[offset].weather[0].icon + ".png";
        var dayBoxIcon = $('<img/>');
        $(dayBoxIcon).attr('src', thisIconURL);
        $(dayBoxIcon).attr('style', 'width: 40px');
        $(dayBox).append(dayBoxIcon);
        
        var dayBoxConditions = $('<ul/>');
        $(dayBoxConditions).attr('style', 'padding: 0; list-style-type: none');

        var dayTemp = $('<li/>');
        $(dayTemp).text('Temp: ' + Math.floor((parseInt(weatherInfo.list[offset].main.temp)-273.15)*9/5+32) + "˚F");
        $(dayBoxConditions).append(dayTemp);

        var dayWind = $('<li/>');
        $(dayWind).text('Wind: ' + weatherInfo.list[offset].wind.speed+ " MPH");
        $(dayBoxConditions).append(dayWind);

        var dayHumidity = $('<li/>');
        $(dayHumidity).text('Humidity: ' + weatherInfo.list[offset].main.humidity+ "%");
        $(dayBoxConditions).append(dayHumidity);

        $(dayBox).append(dayBoxConditions);

        $(btmRow).append(dayBox);
        offset += 8;
    }

    $(midText).text(blankDay + "-Day Forecast:");

    $(bigCol).append(btmRow);
    $('.main-row').append(bigCol);
}



function displaySearches(){
    $('.saved-searches').empty();
    $('.clear-btn-wrapper').empty();
    if(pastSearches==null){
        return;
    }
;   for(var i=0; i<pastSearches.length; i++){
        let cityName = pastSearches[i];
        let btn = $('<button/>',
        {
            text: cityName,
            class: 'search-again'
        });
        $(btn).on('click', function () {
            getWeather(cityName);
        });
        $('.saved-searches').append(btn, '<br>');
    }
    var clearBtn = $('<button/>',
    {
        text: 'Clear',
        class: 'search-again clear-btn'
    });
    $(clearBtn).on('click', function() {
        localStorage.setItem("pastSearches", null);
        pastSearches = null;
        displaySearches();
    });
    $('.clear-btn-wrapper').append(clearBtn, '<br>');
}

displaySearches();

function handleFormSubmission(){
    let city = $('.city-input').val();
    $('.city-input').val('');
    if(city !== '' && city !== null){
        saveSearch(city);
        getWeather(city);
    }
}

$('.search-button').on("click", function (event){
    event.preventDefault();
    handleFormSubmission();
});

$('.input-form').on("submit", function (event){
    event.preventDefault();
    handleFormSubmission();
});
