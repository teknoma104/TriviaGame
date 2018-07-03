var startGameText = "Welcome to the video game trivia! Click the start button at the bottom to begin.";
var instructionText = "You will get 30 seconds to answer each question. There are 10 questions in all.";

var difficulty = "";

// The createRow function takes data returned by OMDB and appends the table data to the tbody
var createRow = function (data) {
    // Get reference to existing tbody element, create a new table row element
    var tBody = $("tbody");
    var tRow = $("<tr>");

    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var titleTd = $("<td>").text(data.Title);
    var yearTd = $("<td>").text(data.Year);
    var actorsTd = $("<td>").text(data.Actors);
    // Append the newly created table data to the table row
    tRow.append(titleTd, yearTd, actorsTd);
    // Append the table row to the table body
    tBody.append(tRow);
};

// The search OMDB function takes a movie, searches the omdb api for it, and then passes the data to createRow
var searchOMDB = function (movie) {
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        createRow(response);
    });
};



// Search the OMDB API for the following movies, and append table rows for each
searchOMDB("Mr. Nobody");
searchOMDB("The Little Mermaid");
searchOMDB("The Lion King");


$(document).ready(function () {
    $("#info-box").html(startGameText);

    $("#start-button").click(function () {
        alert("Time to play the game!!");
        $(this).hide();
        $(".info-text").html("");
    });
});