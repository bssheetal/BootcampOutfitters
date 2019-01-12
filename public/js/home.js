$(document).ready(function () {
    var city;
    function firstrunner() {
        var userId = $(".search").attr("data-id");
        console.log("user id is " + userId);
        $.get(`/login/${userId}`, function (data) {
            console.log("city is" + JSON.stringify(data[0].city));
            city = data[0].city;
            gethikinginfo();
            getweatherinfo();
        });
    }

    firstrunner();

    function slideshowbackgroundimages() {
        var images = [
            "images/hero-01.jpg",
            "images/hero-02.jpg",
            "images/hero-03.jpg",
            "images/hero-04.jpg",
            "images/hero-05.jpg",
            "images/hero-06.jpg"
        ];
        var showImage;
        var count = 0;
        function displayImage() {
            var div = $(".mySlides").html(
                "<img src=" + images[count] + " width='100%'> "
            );
        }

        function nextImage() {
            // Increment the count by 1.
            count++;

            displayImage();

            // If the count is the same as the length of the image array, reset the count to 0.
            if (count === images.length) {
                count = 0;
            }
        }

        function slideshow() {
            showImage = setInterval(nextImage, 13000);
            // displayImage();
        }

        slideshow();
    }

    // slideshowbackgroundimages();

    $("#searchButton").on("click", function (e) {
        e.preventDefault();
        $("#hikingDiv").empty();
        gethikinginfo();
        getweatherinfo();
    });


    function gethikinginfo() {
        var region = $("#inlineFormInput").val().trim();
        var miles = $("#inputGroupSelect01 option:selected").val();
        console.log("hikingregion is" + city);
        if (region === " " || region.length == 0 || region == null) {
            var searchinfo = {
                region: city,
                miles: 15
            };
        } else {
            var searchinfo = {
                region: region,
                miles: miles
            };
        }

        $.get("/hiking", searchinfo, function (response) {
            console.log(response);

            for (var i = 0; i < response.length; i++) {
                trailInfo = response[i];
                var difficulty;
                var newDiv = $("<div>");

                newDiv.addClass("col-sm-4");
                if (trailInfo.difficulty === "blue") {
                    difficulty = "Medium";
                } else if (trailInfo.difficulty === "blueBlack") {
                    difficulty = "Hard";
                } else if (trailInfo.difficulty === "greenBlue") {
                    difficulty = "Easy";
                } else if (trailInfo.difficulty === "green") {
                    difficulty = "Easy";
                } else if (trailInfo.difficulty === "black") {
                    difficulty = "Hard";
                } else if (trailInfo.difficulty === "dblack") {
                    difficulty = "ExtremelyHard";
                }

                var newDiv = $("<div>").addClass("card card-trail mt-4");
                var newDiv = $("<div>").addClass("card card-trail mt-3 mb-3");

                newDiv
                    .attr("data-actNum", trailInfo.id)
                    .attr("data-actName", trailInfo.name)
                    .attr("data-actDiff", difficulty)
                    .attr("data-actLength", trailInfo.length)
                    .attr("data-actRating", trailInfo.stars)
                    .attr("data-lat", trailInfo.latitude)
                    .attr("data-lng", trailInfo.longitude)
                    .attr("data-summary", trailInfo.summary)
                    .attr("data-ascent", trailInfo.ascent)
                    .attr("data-descent", trailInfo.descent)
                    .attr("data-rating", trailInfo.stars);

                var newIMG = $("<img>");
                newIMG.addClass("trailImg card-image-top");
                var trailIMG = trailInfo.imgSmall;
                if (trailIMG == "") {
                    trailIMG =
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZnN0W990Rs6d4UGDcD_wO2mLZ-j8Q-AD_WibHGs5ztvRrz9L";
                }
                newIMG.attr("src", trailIMG);

                var newCardbody = $("<div>").addClass("card-body");
                var newP = $("<p>");
                var newH = $("<h5>");
                var newB = $("<button>");
                newH.append(trailInfo.name);
                newB
                    .append('<i class="fas fa-list"></i> Add to List')
                    .addClass("addButton btn-primary");
                newB
                    .attr("type", "submit")
                    .attr("data-actName", trailInfo.name)
                    .attr("data-actLoc", trailInfo.location)
                    .attr("data-length", trailInfo.length)
                    .attr("data-difficulty", difficulty)
                    .attr("data-summary", trailInfo.summary)
                    .attr("data-ascent", trailInfo.ascent)
                    .attr("data-descent", trailInfo.descent);

                console.log(trailInfo);

                newP.append(trailInfo.location);
                newCardbody.append(newH);
                newCardbody.append(newP);
                newCardbody.append(newB);

                newDiv.append(newIMG, newCardbody);
                $("#hikingDiv").append(newDiv);
            }
        });
    }

    function getweatherinfo() {
        var region = $("#inlineFormInput")
            .val()
            .trim();

        if (region === " " || region.length == 0 || region == null) {
            var searchinfo = {
                region: city
            };
        } else {
            var searchinfo = {
                region: region
            };
        }
        $.get("/weather", searchinfo, function (response) {
            // Clears div, so doesn't show same info again
            $("#weatherDiv").empty();

            console.log("weather api response is " + JSON.stringify(response));
            var city = response[0].current.observationpoint;

            $("#weatherDiv").append("5 Day Forecast for: " + city);

            var forecastDiv = $('<div class = "forecast">');
            for (var i = 0; i < response[0].forecast.length; i++) {
                var currentDay = response[0].forecast[i];
                var conditionsImgs =
                    `http://blob.weather.microsoft.com/static/weather4/en-us/law/` +
                    currentDay.skycodeday +
                    ".gif";

                console.log(currentDay);
                var dayDiv = $('<div class = "daydiv">');
                var dateDiv = $(
                    "<p class = 'forecastFont'>" + currentDay.date + "</p>"
                );
                var dayofwkDiv = $(
                    "<p class = 'forecastFont'>" + currentDay.day + "</p>"
                );
                var skytxtDiv = $(
                    "<p class = 'forecastFont'>" + currentDay.skytextday + "</p>"
                );
                var skycodeDiv = $(
                    "<img src = " + conditionsImgs + " class = 'forecastFont'>"
                );
                var highDiv = $(
                    "<p class = 'forecastFont'> High: " +
                    currentDay.high +
                    "\u00B0F" +
                    "</p>"
                );
                var lowDiv = $(
                    "<p class = 'forecastFont'> Low: " +
                    currentDay.low +
                    "\u00B0F" +
                    "</p>"
                );

                dayDiv.append(dateDiv);
                dayDiv.append(dayofwkDiv);
                dayDiv.append(skytxtDiv);
                dayDiv.append(skycodeDiv);
                dayDiv.append(highDiv);
                dayDiv.append(lowDiv);

                forecastDiv.append(dayDiv);
            }
            $("#weatherDiv").append(forecastDiv);
        });
    }

    // On click listener for the add to list button
    $(document).on("click", ".addButton", function (e) {
        e.preventDefault();
        // Attaching data attributes to the button on UI
        let trailName = $(this).data("actname");
        let trailLocation = $(this).data("actloc");
        let trailLength = $(this).data("length");
        let trailDiff = $(this).data("difficulty");
        let trailSummary = $(this).data("summary");
        let trailAscent = $(this).data("ascent");
        let trailDescent = $(this).data("descent");
        // Setting object with above to send to DB
        let upload = {
            text: trailName,
            description: trailLocation,
            lengthOfTrail: trailLength,
            difficulty: trailDiff,
            summary: trailSummary,
            ascent: trailAscent,
            descent: trailDescent
        };

        // POST request to send upload object from above to DB
        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "/api/items",
            data: JSON.stringify(upload)
        })
            .then(function (data) {
                // Taking the response from DB and rendering the add-to-list value to UI 
                $("#example-list").append(`<li>${data.text}</li>`);
                // Refreshing only the div and not the entire page so as to retain data from GET
                $("#bucketDiv").load(document.URL + " #bucketDiv");
            })
            .catch(function (err) {
                console.log(err);
                alert(err.responseText);
            });
    });


    // On click listener for the check button (activity completed)
    $(document).on("click", ".complete", function (e) {
        e.preventDefault();
// Retrieving the data-complete attribute value from the DOM, which is set as default false in DB
        let idtoComplete = ($(this).parent().attr("data-complete"));
        // Retrieve id of activity 
        let id = $(this).parent().attr("data-id");
// True/false toggle 
        if (idtoComplete == "false") {
            idtoComplete = true;
        } else {
            idtoComplete = false;
        }

        // PUT request to upload new complete value to DB
        let idUpload = {
            complete: idtoComplete
        }
        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "PUT",
            url: "/api/items/" + id,
            data: JSON.stringify(idUpload)
        })
            .then(function (data) {
                // Reloading bucket div to show new state
                $("#bucketDiv").load(document.URL + " #bucketDiv");
            })
            .catch(function (err) {
                console.log(err);
                alert(err.responseText);
            });
    });


    $(document).on("click", ".trailImg", function () {
        console.log("im clicked");
        $(".insidemodal").empty();
        var modaldiv = $("<div>");
        modaldiv.addClass("insidemodal");       
        var name = $(this)
            .closest("div")
            .attr("data-actName");
        console.log("this is pointing to" + name);
        $(".myModalLabel").text(name);
        var newIMG = $("<img>");
        newIMG.addClass("modalimg");
        var trailIMG = $(this).attr("src");
        newIMG.attr("src", trailIMG);
        var lengthp = $("<p>");
        var Length = $(this)
            .closest("div")
            .attr("data-actLength");
        lengthp.append(`<p>Distance: ${Length} miles.</p>`);
        var diffp = $("<p>");
        var difflevel = $(this)
            .closest("div")
            .attr("data-actDiff");
        // if(difflevel==="Easy")
        // {
        //     diffp.attr('style','font-color=green');
        //     diffp.append(`<p>Difficulty: ${difflevel}`);
        // }    
        diffp.append(`<p>Difficulty: ${difflevel}`);
        var summary = $(this)
            .closest("div")
            .attr("data-summary");
        console.log(name);
        var newsummary = $("<p>");
        newsummary.append(`<p> ${summary}</p>`);
        var ascentp = $("<p>");
        var Ascent = $(this)
            .closest("div")
            .attr("data-ascent");
        var Descent = $(this)
            .closest("div")
            .attr("data-descent");
        ascentp.append(
            `<p>Ascent:${Ascent},      Descent:${Descent}</p>`
        );
        var ratingp = $("<p>");
        var Ratings = $(this)
            .closest("div")
            .attr("data-rating");
        ratingp.append(`<p>Ratings: ${Ratings}/5 stars</p>`)
        // modaldiv.append(newP);
        modaldiv.append(newIMG);
        modaldiv.append(newsummary);
        modaldiv.append(lengthp);
        modaldiv.append(diffp);       
        modaldiv.append(ascentp);
        modaldiv.append(ratingp);

        $(".modal-body").append(modaldiv);
        $("#myModal").modal("show");
    });
});
