const APIKey = "4b59a40f09c8d36a73b9057b6f2c3908";
let cityName = $("#city-name").val();
// Current weather data: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    APIKey;

function addCity() {
    cityName = $("#city-name").val();
    // Current weather data: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        APIKey;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        // Display citys to the left panel

        $("#search-result-list").append(
            $("<button>")
                .text(response.name)
                .addClass("list-group-item list-group-item-action ml-2")
                .attr("type", "button")
                .attr("value", cityName)
        );
    });
}
function displayCity() {
    cityName = $("#city-name").val();
    // Current weather data: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        APIKey;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        // Create essential variables for current date and weather icon
        const now = moment().format("MM/DD/YYYY");
        const weatherIcon = $(
            "<img src = http://openweathermap.org/img/wn/" +
                response.weather[0].icon +
                ".png>"
        );

        // Display info for the current-weather
        const card = $("<div>").addClass("card mx-3 mb-2");
        const cardBody = $("<div>").addClass("card-body");
        card.append(cardBody);

        cardBody.append(
            $("<h3>")
                .text(response.name + " (" + now + ")")
                .addClass("card-title")
                .append(weatherIcon)
        );

        const tempF = (response.main.temp - 273.15) * 1.8 + 32;
        cardBody.append(
            $("<p>")
                .text("Temperature: " + tempF.toFixed(2) + " °F")
                .addClass("card-text")
        );

        cardBody.append(
            $("<p>")
                .text("Humidity: " + response.main.humidity + "%")
                .addClass("card-text")
        );

        cardBody.append(
            $("<p>")
                .text("Wind Spped: " + response.wind.speed + " MPH")
                .addClass("card-text")
        );

        // Rendering the UV index
        // UV data: http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
        const lat = response.coord.lat;
        const lon = response.coord.lon;
        const UVIndexURL =
            "http://api.openweathermap.org/data/2.5/uvi?&appid=" +
            APIKey +
            "&lat=" +
            lat +
            "&lon=" +
            lon;
        $.ajax({
            url: UVIndexURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            const value = response.value;
            console.log(value);

            const index = $("<button>").text(value);

            cardBody.append(
                $("<p>").text("UV Index: ").addClass("card-text").append(index)
            );

            // Coloring UV index value to indicate whether the conditions are favorable, moderate, or severe
            if (value < 3) {
                index.addClass("btn bg-success");
            } else if (value >= 3 && value < 8) {
                index.addClass("btn bg-warning");
            } else {
                index.addClass("btn bg-danger");
            }
        });

        // Clear current city's weather conditions before displaying new city's
        $("#current-weather").text(" ");
        $("#current-weather").append(card);

        // Display 5-day forcast for the searched city
        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}
        const forcastURL =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat +
            "&lon=" +
            lon +
            "&exclude=current,minutely,hourly&appid=" +
            APIKey;

        $.ajax({
            url: forcastURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            const cardDeck = $("<div>").addClass("card-deck ml-3");
            let card;
            let cardBody;
            let cardIcon;
            let date;
            let temp;
            for (let i = 1; i < 6; i++) {
                card = $("<div>")
                    .addClass("card col-2")
                    .attr("style", "background-color:#2979ff");
                cardBody = $("<div>").addClass("card-body");
                card.append(cardBody);
                cardDeck.append(card);

                // creating date and icon variables
                cardIcon = $(
                    "<img src = http://openweathermap.org/img/wn/" +
                        response.daily[i].weather[0].icon +
                        ".png>"
                );
                date = new Date(1000 * response.daily[i].dt);
                cardBody.append(
                    $("<h5>")
                        .text(date.toGMTString())
                        .addClass("card-title")
                        .append(cardIcon)
                );

                temp = (response.daily[i].temp.day - 273.15) * 1.8 + 32;
                cardBody.append(
                    $("<p>")
                        .text("Temp: " + temp.toFixed(2) + " °F")
                        .addClass("card-text")
                );
                cardBody.append(
                    $("<p>")
                        .text("Humidity: " + response.daily[i].humidity + "%")
                        .addClass("card-text")
                );

                // Same effect as $("#current-weather").text(" ");
                $("#future-weather").text(" ");
                $("#future-weather").append(
                    $("<h3>").text("5-Day Forecast:").addClass("col-12 ml-3")
                );
                $("#future-weather").append(cardDeck);
            }
        });
    });
}

// Remember to prevent browser default behaviour
$("#search-button").on("click", function (e) {
    e.preventDefault();
    addCity();
    displayCity();
});

$("#search-result-list").on("click", (event) => {
    event.preventDefault();
    // Listen to the clicked city
    if (event.target !== event.currentTarget) {
        const name = event.target.value;
        console.log(name);
        $("#city-name").val(name);
        displayCity();
    }
});
