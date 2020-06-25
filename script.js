// Remember to prevent browser default behaviour
$("#search-button").on("click", function (e) {
    e.preventDefault();
    displayCity();
});

const APIKey = "4b59a40f09c8d36a73b9057b6f2c3908";

function displayCity() {
    const cityName = $("#city-name").val();
    // Current weather data: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    const queryURL =
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
        );

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

        $("#current-weather").append(card);

        // Display 5-day forcast for the searched city
        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}
        $("#future-weather").append(
            $("<h3>").text("5-Day Forecast:").addClass("ml-3")
        );

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
            let card;
            let cardBody;
            let cardIcon;
            let date;
            let temp;
            for (let i = 0; i < 5; i++) {
                card = $("<div>").addClass("card col-3");
                cardBody = $("<div>").addClass("card-body");
                card.append(cardBody);

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

                $("#future-weather").append(card);
            }
        });
    });
}
