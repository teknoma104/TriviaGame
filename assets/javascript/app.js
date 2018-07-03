var startGameText = "Welcome to the video game trivia! Click the start button at the bottom to begin.";
var instructionText = "You will get 30 seconds to answer each question. There are 10 questions in all.";

var difficulty = "";
var questionsArray = [{ q: "", ca: "", ia: [] }];

// The createRow function takes data returned by OMDB and appends the table data to the tbody
var createQA = function (data) {
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
var retrieveQuestions = function (mode) {
    var queryURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=" + mode + "";

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        createQA(response);
        console.log(response);

        var obj = {};

        console.log("Total # of responses: " + response.results.length);
        console.log(response.results[0].question);
        console.log(response.results[0].correct_answer);
        console.log(response.results[0].incorrect_answers);
        console.log(response.results[0].incorrect_answers.length);
        console.log(response.results[0].incorrect_answers[0]);
        console.log(response.results[0].incorrect_answers[1]);
        console.log(response.results[0].incorrect_answers[2]);


        for (var x = 0; x < response.results.length; x++) {
            console.log("================= Loop " + x + " =================");
            console.log("The question is: " + response.results[x].question);
            console.log("The correct answer is: " + response.results[x].correct_answer);
            console.log("There are " + response.results[x].incorrect_answers.length + " incorrect answers.");

            questionsArray[x] = {
                "q": response.results[x].question,
                "ca": response.results[x].correct_answer
            }

            console.log("Testing questionArray question: " + questionsArray[x].q);
            console.log("Testing questionArray correct answer: " + questionsArray[x].ca);

            console.log("There are " + response.results[x].incorrect_answers.length + " incorrect answers.");

            for (var y = 0; y < response.results[x].incorrect_answers.length; y++) {
                console.log("Starting y loop: number " + y);
                console.log("Trying to assign questionsArray[" + x + "].ic[" + y + "] the value");
                console.log("from respone.results[" + x + "].incorrect_answers[" + y + "] which is " + response.results[x].incorrect_answers[y]);
                console.log(response.results[x].incorrect_answers[y]);
                questionsArray[x].ic[y] = response.results[x].incorrect_answers[y];
            }
            console.log("================= End Loop  =================");
        }




    }






        // $.when.apply($, questionsArray.map(function(queryURL) {
        //     return $.ajax(queryURL);
        // })).done(function() {
        //     var results = [];

        //     for (var x = 0; x < arguments.length; x++) {
        //         results.push(arguments[x][0]);
        //         console.log("Pushing " + arguments[x][0]);
        //     }
        // })
    )
};



$(document).ready(function () {
    $("#info-box").html(startGameText);

    $("#start-button").click(function () {
        alert("Time to play the game!!");
        $(this).hide();
        $("#easyMode").removeClass("initiallyHidden");
        $("#mediumMode").removeClass("initiallyHidden");
        $("#hardMode").removeClass("initiallyHidden");
        $(".info-text").html("");
    });

    $("#easyMode").click(function () {
        console.log("User click easy mode");
        difficulty = "easy";
        console.log("Difficulty now set to: " + difficulty);
        retrieveQuestions(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#mediumMode").click(function () {
        console.log("User click medium mode");
        difficulty = "medium";
        console.log("Difficulty now set to: " + difficulty);
        retrieveQuestions(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#hardMode").click(function () {
        console.log("User click hard mode");
        difficulty = "hard";
        console.log("Difficulty now set to: " + difficulty);
        retrieveQuestions(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });
});