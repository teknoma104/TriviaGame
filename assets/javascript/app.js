var startGameText = "Welcome to the video game trivia! Click the start button at the bottom to begin.";
var instructionText = "You will get 30 seconds to answer each question. There are 10 questions in all.";

var difficulty = "";
var questionsArray = [{ question: "", correctAnswer: "", incorrectAnswer: [] }];

var questionCounter = 0;

var timerID;
var timerRemaining = 30;
var reachedZero = false;

var questionContainer = $("#question-container");

// The createRow function takes data returned by OMDB and appends the table data to the tbody
// var createQA = function (data) {
//     // Get reference to existing tbody element, create a new table row element
//     var tBody = $("tbody");
//     var tRow = $("<tr>");

//     // Methods run on jQuery selectors return the selector they we run on
//     // This is why we can create and save a reference to a td in the same statement we update its text
//     var titleTd = $("<td>").text(data.Title);
//     var yearTd = $("<td>").text(data.Year);
//     var actorsTd = $("<td>").text(data.Actors);
//     // Append the newly created table data to the table row
//     tRow.append(titleTd, yearTd, actorsTd);
//     // Append the table row to the table body
//     tBody.append(tRow);
// };

// The search OMDB function takes a movie, searches the omdb api for it, and then passes the data to createRow
var retrieveAndParseQA = function (mode) {
    var queryURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=" + mode + "";

    console.log("retrieveAndParseQA function called");
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        console.log("Total # of responses: " + response.results.length);
        console.log("Response's question:  " + response.results[0].question);
        console.log("Response's correct answer:  " + response.results[0].correct_answer);
        console.log("Response's # of incorrect answers:  " + response.results[0].incorrect_answers.length);
        console.log("Response's total incorrect answer(s):  " + response.results[0].incorrect_answers);
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
                "ca": response.results[x].correct_answer,
                "ia": []
            }

            console.log("Testing questionArray question: " + questionsArray[x].q);
            console.log("Testing questionArray correct answer: " + questionsArray[x].ca);

            console.log("There are " + response.results[x].incorrect_answers.length + " incorrect answers.");

            for (var y = 0; y < response.results[x].incorrect_answers.length; y++) {
                console.log("Starting y loop: number " + y);
                console.log("Incorrect answer #" + y +": " + response.results[x].incorrect_answers[y]);
                console.log(response.results[x].incorrect_answers[y]);

                questionsArray[x].ia[y] = response.results[x].incorrect_answers[y];
            }

            console.log("Testing incorrect answer array: " + questionsArray[x].incorrectAnswer);

            console.log("================= End Loop  =================");
        }
    }).then(function () {
        displayQuestions();
    });

};



function displayQuestions() {
    console.log("displayQuestions function called");

    questionContainer.append(createCard(questionsArray[questionCounter]));

    countdownStart();
}

function countdownStart() {
    console.log("30 second timer started");
    timerID = setInterval(count, 1000);
}

function stop() {

    console.log("stopping");
    clearInterval(timerID);

}

function count() {

    timerRemaining--;
    var converted = timeConverter(timerRemaining);

    $("#timer").text(converted);
    if (converted === "00:00")
        stop();

}

function timeConverter(t) {

    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes === 0) {
        minutes = "00";
    }
    else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card

    console.log("createCard function called");
    var answersCombined = [];

    console.log("question: " + article.q);

    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append($("<h6>").append(article.q));

    console.log("correct answer: " + article.ca);
    console.log("incorrect answer: " + article.ia);

    answersCombined.push(article.ca);
    console.log("Showing answersCombined after pushing article.ca:  " + answersCombined);

    if (article.ia.length === 1)
        answersCombined.push(article.ia);
    else {
        for (var x = 0; x < article.ia.length; x++)
            answersCombined.push(article.ia[x]);
    }
    console.log("Showing answersCombined after pushing article.ia:  " + answersCombined);

    for (var x = 0; x < answersCombined.length; x++) {
        console.log("Loop #" + x + " to see value of answerCombined[" + x + "]!");
        console.log(answersCombined[x]);
    }

    // If it's a true/false type question, just display the question + true/false answer
    // If there's multiple choice, shuffles the possible answers around in the answersCombined array before displaying the question +  possible answers
    if (answersCombined.length < 3) {
        console.log("answersCombined.length is : " + answersCombined.length);
        console.log("Conditional met for having only 2 possible answers.");

        console.log(JSON.stringify(answersCombined[0]));
        console.log(JSON.stringify(answersCombined[1]));
        var cardBody = $("<div class='card-body'>");
        for (var x = 0; x < answersCombined.length; x++) {
            var paragraph = $("<p>");
            paragraph.text(answersCombined[x]);
            if (answersCombined[x] === article.ca)
                paragraph.attr("id", "correctanswer")

            cardBody.append(paragraph);
        }
    }
    else {
        console.log("Conditional met for having 4 possible answers.");
        console.log("answersCombined preshuffle:  " + answersCombined);
        shuffle(answersCombined);
        console.log("answersCombined shuffled now:  " + answersCombined);


        var cardBody = $("<div class='card-body'>");
        for (var x = 0; x < answersCombined.length; x++) {
            var paragraph = $("<p>");
            paragraph.text(answersCombined[x]);
            cardBody.append(paragraph);
        }
        // $("<p>").text(JSON.stringify(answersCombined[0])) +
        // $("<p>").text(JSON.stringify(answersCombined[1])) +
        // $("<p>").text(JSON.stringify(answersCombined[2])) +
        // $("<p>").text(JSON.stringify(answersCombined[3]));

        console.log(JSON.stringify(answersCombined[0]));
        console.log(JSON.stringify(answersCombined[1]));
        console.log(JSON.stringify(answersCombined[2]));
        console.log(JSON.stringify(answersCombined[3]));
    }

    card.append(cardHeader, cardBody);

    return card;
}

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
        retrieveAndParseQA(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#mediumMode").click(function () {
        console.log("User click medium mode");
        difficulty = "medium";
        console.log("Difficulty now set to: " + difficulty);
        retrieveAndParseQA(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#hardMode").click(function () {
        console.log("User click hard mode");
        difficulty = "hard";
        console.log("Difficulty now set to: " + difficulty);
        retrieveAndParseQA(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });
});