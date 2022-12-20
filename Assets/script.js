//openweatherapikey
const key = '37dc5cb97cecc77ea9e04e3af68fc80b';
let weatherInfo;
let pastSearches = JSON.parse(localStorage.getItem("pastSearches"));


//takes user submitted city query and uses it to query oepn weather api. saves result into 'weatherInfo' global var.
async function getWeather(city){

    let geoCodingURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + "&appid=" + key;
    let cityInfo = null;
    await fetch(geoCodingURL)
        .then((resp) => resp.json())
        .then( function(data) {
            cityInfo = data;
        })
        .catch( function(error) {
            console.log(error);
            window.alert('City not found');
        });
    if(cityInfo.length != 0){
        let weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityInfo[0].lat + '&lon=' + cityInfo[0].lon + "&appid=" + key;
        await fetch(weatherURL)
            .then((resp) => resp.json())
            .then( function(data) {
                weatherInfo = data;
                saveSearch(city);
                displayWeather();
            })
            .catch( (error) => {
                console.log(error);
                window.alert('City not found');
            });
    }
    
}

//displays current and upcoming weather from weatherInfo.
function displayWeather(){

    $('.spacer').attr('style', 'display:none');
    $('.big-col').remove();

    var bigCol = $('<div/>',{
        class: 'col-12 col-lg-9 big-col',
    });

    var topRow = $('<div/>',{
        class: 'row'
    });
    
    var todayBox = $('<div/>',{
        class: 'col-12 border border-dark today-box'
    });
    $(todayBox).attr('style', 'width: 97%; margin: 10px auto 10px 10px;')

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
    $(midRow).attr('style', 'margin-top: 5px;');

    var midCol = $('<div/>',{
        class: 'col-12'
    });
    

    var midText = $('<h3/>');

    $(midCol).append(midText);
    $(midRow).append(midCol);

    $(bigCol).append(midRow);

    var btmRow = $('<div/>',{
        class: 'row'
    });

    $(btmRow).attr('style', 'margin: 0px;')

    var blankDay = 0;
    var offset = 8;
    while(offset<40){
        blankDay++;
        var dayBox = $('<div>', {
            class: 'col-md'
        });

        var dayBoxHeadline = $('<h3/>');

        var thisDate = weatherInfo.list[offset].dt_txt.split(" ")[0].split("-");
        thisDate.push(thisDate.shift());
        thisDate = thisDate.join("/");
        $(dayBoxHeadline).text(thisDate);
        $(dayBox).append(dayBoxHeadline);
        $(dayBox).attr('style', 'margin: 3px; background: #323d4f; color: white; padding: 5px;');

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

//appends argument 'city' to pastSearches array of strings stored in local storage.
function saveSearch(city){
    if(pastSearches==null){
        pastSearches = [];
    }
    let beenSearched = false;
    for(var i=0; i<pastSearches.length; i++){
        if(pastSearches[i] == city){
            beenSearched = true;
            break;
        }
    }
    if(!beenSearched){
        pastSearches.push(city);
        localStorage.setItem("pastSearches",JSON.stringify(pastSearches));
    }
    displaySearches();
}

//removes search x from pastSearches array
function removeSearch(x){
    let cityName = x.parent().text().slice(0,-1);
    pastSearches = pastSearches.filter( e => e !== cityName);

    if(pastSearches.length == 0){
        pastSearches = null;
    }
    localStorage.setItem("pastSearches",JSON.stringify(pastSearches));  
    displaySearches();
}

//displays buttons beneath searh bar with users previously searched cities
function displaySearches(){
    $('.saved-searches').empty();
    //$('.clear-btn-wrapper').empty();
    pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
    if(pastSearches==null){
        return;
    }
;   for(var i=0; i<pastSearches.length; i++){

        let cityName = pastSearches[i];
        let btn = $('<div>');
        btn.attr('class', 'search-again draggable');
        btn.attr('style', 'cursor: pointer; text-align: center;');
        btn.text(cityName);
        $(btn).on('click', function (event) {
            event.stopPropogation;
            getWeather(cityName);
        });

        $('.saved-searches').append(btn);

        //adds x to right side of each button. clicking it called 'removeSearch' on that button.
        let x = $('<span>');
        x.text('x');
        x.attr('style','float: right; margin-right: 11px; cursor: pointer; font-weight: bolder;');
        btn.append(x);
        $(x).on('click', function (event) {
            event.stopPropogation;
            removeSearch(x);
        });
    }


    //Copied code to add drag and drop reorder functionality to saved search list.

    //------ FOLLOWING CODE COPIED/ADAPTED FROM https://htmldom.dev/drag-and-drop-element-in-a-list/ 


    // The current dragging item
    let draggingEle;

    // The current position of mouse relative to the dragging element
    let x = 0;
    let y = 0;

    const mouseDownHandler = function (e) {
        if(e.target.innerText=='x'){
            return;
        }
        draggingEle = e.target;
        // Calculate the mouse position
        const rect = draggingEle.getBoundingClientRect();
        x = e.pageX - rect.left;
        y = e.pageY - rect.top;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    // Query the list element
    const list = document.getElementById('list');

    // Query all items
    Array.prototype.slice.call(list.children).forEach(function (item) {
        item.addEventListener('mousedown', mouseDownHandler);
    });

    let placeholder;
    let isDraggingStarted = false;

    const mouseMoveHandler = function(e) {

        let w = draggingEle.offsetWidth;
        let h = draggingEle.offsetHeight;
        // Set position for dragging element
        draggingEle.style.position = 'absolute';
        draggingEle.style.top = `${e.pageY - y}px`;
        draggingEle.style.left = `${e.pageX - x}px`;
        draggingEle.style.width = `${w}px`;
        
        if (!isDraggingStarted) {
            // Update the flag
            isDraggingStarted = true;

            // Let the placeholder take the height of dragging element
            // So the next element won't move up
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            draggingEle.parentNode.insertBefore(
                placeholder,
                draggingEle.nextSibling
            );

            // Set the placeholder's height
            placeholder.style.height = `${4/3*h}px`;
        }
        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        // User moves item to the top
        if (prevEle && isAbove(draggingEle, prevEle)) {
            // The current order    -> The new order
            // prevEle              -> placeholder
            // draggingEle          -> draggingEle
            // placeholder          -> prevEle
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        }

        // User moves the dragging element to the bottom
        if (nextEle && isAbove(nextEle, draggingEle)) {
            // The current order    -> The new order
            // draggingEle          -> nextEle
            // placeholder          -> placeholder
            // nextEle              -> draggingEle
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        }
    }

    const mouseUpHandler = function() {
        
        let newSavedSearches = [];

        for(var i=0; i<draggingEle.parentNode.children.length; i++){
            newSavedSearches.push(draggingEle.parentNode.children[i].textContent.slice(0,-1));
        }

        newSavedSearches = newSavedSearches.filter( e => e !== '');
        localStorage.setItem("pastSearches", JSON.stringify(newSavedSearches));

        // Remove the position styles
        draggingEle.style.removeProperty('top');
        draggingEle.style.removeProperty('left');
        draggingEle.style.removeProperty('position');

        x = null;
        y = null;
        draggingEle = null;

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        // Remove the placeholder
       if(placeholder!==undefined && placeholder.parentNode !== null){
            placeholder.parentNode.removeChild(placeholder);
       }
        // Reset the flag
        isDraggingStarted = false;
    };

    const isAbove = function (nodeA, nodeB) {
        // Get the bounding rectangle of nodes
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    };

    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        // Move `nodeA` to before the `nodeB`
        nodeB.parentNode.insertBefore(nodeA, nodeB);

        // Move `nodeB` to before the sibling of `nodeA`
        parentA.insertBefore(nodeB, siblingA);
    };
}

//------ PRECEDING CODE COPIED/ADAPTED FROM https://htmldom.dev/drag-and-drop-element-in-a-list/ 

//display saved searches on page load
displaySearches();

//get user input from search bar, clear the bar, and call getWeather on input
function handleFormSubmission(){
    let city = $('.city-input').val();
    $('.city-input').val('');
    if(city !== '' && city !== null){
        getWeather(city);
    }
}


//attach same behavior to clicking search button or hitting enter
$('.search-button').on("click", function (event){
    event.preventDefault();
    handleFormSubmission();
});

$('.input-form').on("submit", function (event){
    event.preventDefault();
    handleFormSubmission();
});