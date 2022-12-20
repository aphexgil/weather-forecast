# 06 Server-Side APIs: Weather Dashboard

Weather dashboard is a graphical user interface for Open Weather API. User inputs the name of city into the search box and is prompted with information on current and upcoming temperature, humidity and wind speed for that city. 

Every time a search is submitted, it is saved to local storage and all saved cities are then displayed under the search bar as buttons. When these buttons are clicked, the current and upcoming weather for that city is once again displayed.

On the right side of each button, there is an x that can be clicked to remove that city from pastSearches and that button from the screen. Buttons can be dynamically reordered by dragging and dropping them, using code adapted from https://htmldom.dev/drag-and-drop-element-in-a-list/ . This reordering is reflected in local storage, and is saved between visits.

As a note, I attempted to  replicate the visual style from the example image as closely as possible.

Deployed page: https://aphexgil.github.io/weather-forecast/

Image of deployed page: './Assets/aphexgil-weather-dashboard.png'

