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


function decodeSpecialChars(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

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

        console.log("Starting for loop to add the questions+answers into questionsArray");
        for (var x = 0; x < response.results.length; x++) {
            console.log("================= Loop " + x + " =================");
            console.log("The question is: " + response.results[x].question);
            console.log("The correct answer is: " + response.results[x].correct_answer);
            console.log("There are " + response.results[x].incorrect_answers.length + " incorrect answers.");

            questionsArray[x] = {
                "question": response.results[x].question,
                "correctAnswer": response.results[x].correct_answer,
                "incorrectAnswer": []
            }


            console.log("--------------------");
            console.log("Looking for &quot; in question");
            console.log("Before the change:  " + response.results[x].question);
            var checkQuotesQuestion = response.results[x].question;
            var textQuestion = decodeURIComponent(response.results[x].question);
            var decodeQuestion = response.results[x].question;
            var hedecodeQuestion = response.results[x].question;

            checkQuotesQuestion = checkQuotesQuestion.replace(/&quot;/g, '"');
            decodeSpecialChars(decodeQuestion);
            he.decode(hedecodeQuestion);

            console.log("checkQuotesQuestion:  " + checkQuotesQuestion);
            console.log("textQuestion:  " + textQuestion);
            console.log("decodeQuestion:  " + decodeQuestion);
            console.log("hedecodeQuestion:  " + hedecodeQuestion);



            console.log("Looking for &quot; in correct_answer");
            console.log("Before the change:  " + response.results[x].correct_answer);
            var checkQuotesCorrectAnswer = response.results[x].correct_answer;
            var textCorrectAnswer = decodeURIComponent(response.results[x].correct_answer);
            var decodeCorrectAnswer = response.results[x].correct_answer;
            var hedecodeCorrectAnswer = response.results[x].correct_answer;

            checkQuotesCorrectAnswer = checkQuotesCorrectAnswer.replace(/&quot;/g, '"');
            decodeSpecialChars(decodeCorrectAnswer);
            he.decode(hedecodeCorrectAnswer);

            console.log("checkQuotesCorrectAnswer:  " + checkQuotesCorrectAnswer);
            console.log("textCorrectAnswer:  " + textCorrectAnswer);
            console.log("decodeCorrectAnswer:  " + decodeCorrectAnswer);
            console.log("hedecodeCorrectAnswer:  " + hedecodeCorrectAnswer);
            console.log("--------------------");


            console.log("Testing questionArray question: " + questionsArray[x].question);
            console.log("Testing questionArray correct answer: " + questionsArray[x].correctAnswer);

            console.log("There are " + response.results[x].incorrect_answers.length + " incorrect answers.");

            for (var y = 0; y < response.results[x].incorrect_answers.length; y++) {
                console.log("Starting y loop: number " + y);
                console.log("Incorrect answer #" + y + ": " + response.results[x].incorrect_answers[y]);

                questionsArray[x].incorrectAnswer[y] = response.results[x].incorrect_answers[y];
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

    timerRemaining = 30;

    $("#question-container").empty();
    questionContainer.append(createCard(questionsArray[questionCounter]));
    $(".card-body").removeAttr("disabled");

    countdownStart();
}

function countdownStart() {
    console.log("30 second timer started");
    timerID = setInterval(count, 1000);
    $("#message-box").text("");
}

function stop() {

    console.log("stopping");
    clearInterval(timerID);

}

function count() {

    timerRemaining--;
    var converted = timeConverter(timerRemaining);

    $("#timer").text(converted);
    if (converted === "00:00") {
        stop();
        score--;
        console.log("Score is now:  " + score);
        if (questionCounter === 10)
        {
            $("#message-box").html("Sorry You ran out of time. Moving to score screen in 5 seconds.");
            setTimeout(endGame, 1000 * 5);
        }
        else {
            $("#message-box").html("Sorry You ran out of time. Moving to the next question in 5 seconds.");
            setTimeout(displayQuestions, 1000 * 5);
        }

    }

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


function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card

    console.log("createCard function called");
    var answersCombined = [];

    questionCounter++;

    console.log("Question #" + questionCounter);

    console.log("question: " + article.question);

    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append($("<h6>").append("#" + questionCounter + ": " + article.question));

    console.log("correct answer: " + article.correctAnswer);
    console.log("incorrect answer: " + article.incorrectAnswer);

    answersCombined.push(article.correctAnswer);
    console.log("Showing answersCombined after pushing article.ca:  " + answersCombined);

    if (article.incorrectAnswer.length === 1)
        answersCombined.push(article.incorrectAnswer);
    else {
        for (var x = 0; x < article.incorrectAnswer.length; x++)
            answersCombined.push(article.incorrectAnswer[x]);
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

        console.log("Starting for True/False loop to compare answersCombined with article.correctAnswer");
        for (var x = 0; x < answersCombined.length; x++) {
            var paragraph = $("<p>");
            console.log("testing answersCombined[" + x + "]:  " + answersCombined[x]);
            console.log("testing article.correctAnswer:  " + article.correctAnswer);
            paragraph.text(answersCombined[x]);
            if (answersCombined[x] === article.correctAnswer)
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

        console.log("Starting for MultipleChoice loop to compare answersCombined with article.correctAnswer");
        for (var x = 0; x < answersCombined.length; x++) {
            var paragraph = $("<p>");

            console.log("testing answersCombined[" + x + "]:  " + answersCombined[x]);
            console.log("testing article.correctAnswer:  " + article.correctAnswer);
            paragraph.text(answersCombined[x]);

            if (answersCombined[x] === article.correctAnswer)
                paragraph.attr("id", "correctanswer")
            cardBody.append(paragraph);
        }

        console.log(answersCombined[0]);
        console.log(answersCombined[1]);
        console.log(answersCombined[2]);
        console.log(answersCombined[3]);
    }

    card.append(cardHeader, cardBody);

    return card;
}

function endGame() {
    $("#message-box").html("Trivia over! You got " + score + " correct out of 10!");
    $("#reset-button").show();
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

    $("#reset-button").click(function () {

        $(this).hide();

        difficulty = "";
        score = 10;
        questionsArray = [{
            question: "",
            correctAnswer: "",
            incorrectAnswer: []
        }];

        timerRemaining = 30;

        $("#question-container").empty();
        $("#message-box").html("");

        $("#start-button").show();
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

    $("#question-box").on("click", "p", function () {

        console.log("Checking $(<p>).text() value:  " + $(this).text());
        console.log("Checking questionsArray.correctAnswer value:  " + questionsArray[questionCounter - 1].correctAnswer);

        if ($(this).text() === questionsArray[questionCounter - 1].correctAnswer) {
            console.log("Right answer clicked");
            stop();

            console.log("Score is now:  " + score);
            $("#message-box").html("Correct answer! Moving to the next question in 10 seconds.");

            if (questionCounter === 10)
                endGame();
            else
                setTimeout(displayQuestions, 1000 * 10);
        } else {
            console.log("Wrong answer clicked");
            stop();

            score--;
            console.log("Score is now:  " + score);
            $("#message-box").html("Wrong answer! The correct answer was " + questionsArray[questionCounter - 1].correctAnswer + ". Moving to the next question in 10 seconds.");

            if (questionCounter === 10)
                endGame();
            else
                setTimeout(displayQuestions, 1000 * 10);
        }
    });
});