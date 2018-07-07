var startGameText = "Welcome to the video game trivia! Click the start button at the bottom to begin.";
var instructionText = "You will get 30 seconds to answer each question. There are 10 questions in all.";

var difficulty = "";
var score = 10;
var questionsArray = [{
    question: "",
    correctAnswer: "",
    incorrectAnswer: []
}];

var questionCounter = 0;

var timerID;
var timerRemaining = 30;

var questionContainer = $("#question-container");

var winThemes = [
    "./assets/sounds/win/12_applause.wav.mp3",
    "./assets/sounds/win/17 Extra Life.mp3",
    "./assets/sounds/win/18 - 1-Up.mp3",
    "./assets/sounds/win/23 Star Catch Fanfare.mp3",
    "./assets/sounds/win/24 - Stage Clear.mp3",
    "./assets/sounds/win/119 victory.mp3",
    "./assets/sounds/win/FF7 AC Victory Fanfare Ringtone (perfected mp3).mp3",
    "./assets/sounds/win/KirbyDance.wav"
];

var winGifs = [
    "./assets/images/win/donkeykongwin.gif",
    "./assets/images/win/ff8win.gif",
    "./assets/images/win/sakurawin.gif",
    "./assets/images/win/sm64victory.gif",
    "./assets/images/win/spinalwin.gif"
];

var loseThemes = [
    "./assets/sounds/lose/15-player down.mp3",
    "./assets/sounds/lose/18 - Game Over (alternate).mp3",
    "./assets/sounds/lose/25 - Lose.mp3",
    "./assets/sounds/lose/45. Stage-End.mp3",
    "./assets/sounds/lose/120 defeat.mp3",
    "./assets/sounds/lose/209 - player down.mp3"
];

var loseGifs = [
    "./assets/images/lose/bisongameover.gif",
    "./assets/images/lose/crashbandicootlose.gif",
    "./assets/images/lose/donkeykonglose.gif",
    "./assets/images/lose/finalfightgameover.gif",
    "./assets/images/lose/frygameover.gif",
    "./assets/images/lose/spidermangameover.gif",
    "./assets/images/lose/weirdgameover.gif"
];

var playWinTheme = function () {
    var index = Math.floor(Math.random() * (winThemes.length));
    var thisSound = new Audio(winThemes[index]);
    thisSound.play();
}

var playLoseTheme = function () {
    var index = Math.floor(Math.random() * (loseThemes.length));
    var thisSound = new Audio(loseThemes[index]);
    thisSound.play();
}

var displayWinGIF = function () {
    var index = Math.floor(Math.random() * (winGifs.length));
    var thisPic = winGifs[index];
    var winIMG = $("<img>");

    $("#question-container").empty();
    $("#question-container").html(winIMG.attr("src", thisPic));
}

var displayLoseGIF = function () {
    var index = Math.floor(Math.random() * (loseGifs.length));
    var thisPic = loseGifs[index];
    var loseIMG = $("<img>");

    $("#question-container").empty();
    $("#question-container").html(loseIMG.attr("src", thisPic));

}


var retrieveAndParseQA = function (mode) {
    var queryURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=" + mode + "";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var x = 0; x < response.results.length; x++) {

            questionsArray[x] = {
                "question": response.results[x].question,
                "correctAnswer": response.results[x].correct_answer,
                "incorrectAnswer": []
            }


            // Still unfinished section here that is not being used
            // I was testing replace and decodeURIComponent here to try to fix
            // the HTML entity encoding that the opentriviaDB API sends back in its response
            // I only got the replace method to work so that means I needed to add a bunch of replace
            // methods to try to catch all the various special characters which isn't something
            // I really wanted to do, was hoping decodeURIComponent would work
            // console.log("--------------------");
            
            // console.log("Looking for &quot; in question");
            // console.log("Before the change:  " + response.results[x].question);
            // var checkQuotesQuestion = response.results[x].question;
            // var textQuestion = decodeURIComponent(response.results[x].question);
            // checkQuotesQuestion = checkQuotesQuestion.replace(/&quot;/g, '"');
            // console.log("checkQuotesQuestion:  " + checkQuotesQuestion);
            // console.log("textQuestion:  " + textQuestion);


            // console.log("Looking for &quot; in correct_answer");
            // console.log("Before the change:  " + response.results[x].correct_answer);
            // var checkQuotesCorrectAnswer = response.results[x].correct_answer;
            // var textCorrectAnswer = decodeURIComponent(response.results[x].correct_answer);
            // checkQuotesCorrectAnswer = checkQuotesCorrectAnswer.replace(/&quot;/g, '"');
            // console.log("checkQuotesCorrectAnswer:  " + checkQuotesCorrectAnswer);
            // console.log("textCorrectAnswer:  " + textCorrectAnswer);
            // console.log("decodeCorrectAnswer:  " + decodeCorrectAnswer);
            
            // console.log("--------------------");




            for (var y = 0; y < response.results[x].incorrect_answers.length; y++) {
                questionsArray[x].incorrectAnswer[y] = response.results[x].incorrect_answers[y];
            }
        }
    }).then(function () {
        displayQuestions();
    });

};



function displayQuestions() {
    timerRemaining = 30;

    $("#question-container").empty();
    questionContainer.append(createCard(questionsArray[questionCounter]));
    $(".card-body").removeAttr("disabled");

    countdownStart();
}

function countdownStart() {
    timerID = setInterval(count, 1000);
    $("#message-box").text("");
}

function stop() {
    clearInterval(timerID);
}

function count() {

    timerRemaining--;
    var converted = timeConverter(timerRemaining);

    $("#timer").text(converted);
    if (converted === "00:00") {
        stop();
        score--;

        playLoseTheme();
        displayLoseGIF();
        
        if (questionCounter === 10) {
            $("#message-box").html("Sorry You ran out of time. Moving to score screen in 5 seconds.");
            setTimeout(endGame, 1000 * 5);
        }
        else {
            $("#message-box").html("Sorry You ran out of time. Moving to the next question in 5 seconds.");
            setTimeout(displayQuestions, 1000 * 5);
        }

    }

}

// reusing timeConverter function from in-class activity since it is useful to display minutes:seconds easily
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

// Shuffles multiple choice answer array using Fisher-Yates shuffle algorithm
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

// Uses bootstrap cards container to generate dynamic container to display the question and answer in the game
function createCard(article) {
    var answersCombined = [];

    questionCounter++;

    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append($("<h6>").append("#" + questionCounter + ": " + article.question));

    // pushes all the correct and incorrect answers together into one single array so 
    // that it can be easily listed with a for loop
    // If else statement test for true/false or multiple choice questions condition
    answersCombined.push(article.correctAnswer);

    if (article.incorrectAnswer.length === 1)
        answersCombined.push(article.incorrectAnswer);
    else {
        for (var x = 0; x < article.incorrectAnswer.length; x++)
            answersCombined.push(article.incorrectAnswer[x]);
    }


    // If it's a true/false type question, just display the question + true/false answer
    // If there's multiple choice, shuffles the possible answers around in the answersCombined array before displaying the question +  possible answers
    if (answersCombined.length < 3) {
        var cardBody = $("<div class='card-body'>");

        for (var x = 0; x < answersCombined.length; x++) {
            var paragraph = $("<p>");
            paragraph.text(answersCombined[x]);
            if (answersCombined[x] === article.correctAnswer)
                paragraph.attr("id", "correctanswer")

            cardBody.append(paragraph);
        }
    }
    else {
        // shuffle function called so that the answer list isn't the same every time
        shuffle(answersCombined);

        var cardBody = $("<div class='card-body'>");

        for (var x = 0; x < answersCombined.length; x++) {
            var paragraph = $("<p>");

            paragraph.text(answersCombined[x]);

            if (answersCombined[x] === article.correctAnswer)
                paragraph.attr("id", "correctanswer")
            cardBody.append(paragraph);
        }
    }

    card.append(cardHeader, cardBody);

    return card;
}

// displays player's score at the end and shows the reset button 
function endGame() {
    $("#message-box").html("Trivia over! You got " + score + " correct out of 10!");
    $("#reset-button").show();
}

$(document).ready(function () {
    $("#info-box").html(startGameText + "<br>" + instructionText + "<br>There is sounds so turn on your speakers! :)");

    // start button hides itself when clicked
    // also unhides the 3 difficulty mode buttons
    $("#start-button").click(function () {
        alert("Time to play the game!!");
        $(this).hide();
        $("#easyMode").removeClass("initiallyHidden");
        $("#mediumMode").removeClass("initiallyHidden");
        $("#hardMode").removeClass("initiallyHidden");
        $(".info-text").html("");
    });

    // reset button resets all neccessary global variables and resets/empties neccessary containers
    $("#reset-button").click(function () {

        $(this).hide();

        difficulty = "";
        score = 10;
        questionsArray = [{
            question: "",
            correctAnswer: "",
            incorrectAnswer: []
        }];
        questionCounter = 0;

        timerRemaining = 30;

        $("#question-container").empty();
        $("#message-box").html("");
        $("#timer").html("");

        $("#start-button").show();
    });

    $("#easyMode").click(function () {
        difficulty = "easy";

        retrieveAndParseQA(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#mediumMode").click(function () {
        difficulty = "medium";

        retrieveAndParseQA(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#hardMode").click(function () {
        difficulty = "hard";

        retrieveAndParseQA(difficulty);

        $("#easyMode").addClass("initiallyHidden");
        $("#mediumMode").addClass("initiallyHidden");
        $("#hardMode").addClass("initiallyHidden");
    });

    $("#question-box").on("click", "p", function () {
        if ($(this).text() === questionsArray[questionCounter - 1].correctAnswer) {
            playWinTheme();
            stop();

            $("#message-box").html("Correct answer! Moving to the next question in 10 seconds.");

            if (questionCounter === 10)
                endGame();
            else {
                displayWinGIF();
                setTimeout(displayQuestions, 1000 * 10);
            }
        } else {
            playLoseTheme();
            stop();

            score--;

            $("#message-box").html("Wrong answer! The correct answer was " + questionsArray[questionCounter - 1].correctAnswer + ". Moving to the next question in 10 seconds.");

            if (questionCounter === 10)
                endGame();
            else {
                displayLoseGIF();
                setTimeout(displayQuestions, 1000 * 10);
            }
        }
    });
});