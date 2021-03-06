// Ajax calls

function get_circles(){
    $.ajax({
        type: "GET",
        url: "/get_circles",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let circleColors = result["history"]

            circleColors.forEach(function (item, index) {
                let circleNum = index + 1
                $("#dot"+circleNum).addClass(item)
            });
            
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function start_chest(startTime){
    $.ajax({
        type: "PUT",
        url: "/start_chest",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(startTime),
        success: function(result){
            let repNum = result["repNum"]

            $("#chestText").empty();

            countdown(repNum);
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function start_reps(startTime){
    $.ajax({
        type: "PUT",
        url: "/start_reps",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(startTime),
        success: function(result){
            let repNum = result["repNum"]

            console.log(repNum)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function click_chest(clickTime){
    $.ajax({
        type: "PUT",
        url: "/click_chest",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(clickTime),
        success: function(result){
            let repNum = result["repNum"]
            let clickResult = result["clickResult"]
            let finished = result["finished"]

            $("#quizCompCount").text(repNum)

            if (finished === "No"){
                $("#quizCompFeedback").text(clickResult)

                if (clickResult === "Good"){
                    $("#quizCompFeedback").removeClass("redText")
                    $("#quizCompFeedback").addClass("greenText")
                } else{
                    $("#quizCompFeedback").removeClass("greenText")
                    $("#quizCompFeedback").addClass("redText")
                }

            } else{
                $("#quizCompFeedback").empty()
                $("#redChestCircle").addClass("cantClick")
                verifyChest()
            }
         
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function verify_chest(questionInfo){
    $.ajax({
        type: "PUT",
        url: "/verify_chest",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(questionInfo),
        success: function(result){
            let userCorrect = result["userCorrect"]
            let answerText = result["answerText"]
            let numCorrect = result["numCorrect"]

            if (userCorrect === "Yes"){
                $("#imgResult").text(answerText)
                $("#imgResult").removeClass("redText")
                $("#imgResult").removeClass("yellowText")
                $("#imgResult").addClass("greenText")

                $("#dot"+curQuestion["id"]).addClass("greenBackground")
            }else{
                if (userCorrect === "No"){
                    $("#imgResult").text(answerText)
                    $("#imgResult").addClass("redText")

                    $("#dot"+curQuestion["id"]).addClass("redBackground")
                } else{
                    $("#imgResult").text(answerText)
                    $("#imgResult").addClass("yellowText")

                    $("#dot"+curQuestion["id"]).addClass("yellowBackground")
                }
                
            }

            $("#nextQuestion").removeClass("isDisabled")
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

// Helper functions

function startChest(){
    $("#startChestBtn").click(function() {
        startTime = {
                        "questionID": curQuestion["id"]
                     };

        start_chest(startTime);
    });
};

function countdown(repNum){
    $("#chestText").html("<div class='padding'><div class='chestNums'>Get ready!</div></div>");

    setTimeout(function(){
        $("#chestText").html("<div class='margin headerFont'>3</div>");
    }, 1000);

    setTimeout(function(){
        $("#chestText").html("<div class='margin headerFont'>2</div>");
    }, 2000);

    setTimeout(function(){
        $("#chestText").html("<div class='margin headerFont'>1</div>");
    }, 3000);

    setTimeout(function(){
        $("#chestText").html("<div class='margin headerFont'>Go!</div>");
    }, 4000);

    setTimeout(function(){
        $("#chestText").empty();

        let compressionDiv = $("<div>");
        $(compressionDiv).text("Compressions:");
        $(compressionDiv).addClass("subheaderFont");

        let compressionCount = $("<div>");
        $(compressionCount).text(repNum);
        $(compressionCount).attr("id", "quizCompCount");
        $(compressionCount).addClass("chestNums");

        let compressionFeedback = $("<div>");
        $(compressionFeedback).attr("id", "quizCompFeedback");
        $(compressionFeedback).addClass("chestNums");

        $("#chestText").append(compressionDiv);
        $("#chestText").append(compressionCount);
        $("#chestText").append("<br>");
        $("#chestText").append("<br>");
        $("#chestText").append(compressionFeedback);

        // Add red circle on the chest maybe to indicate where the user should click
        let redCircle = $("<span>");
        $(redCircle).addClass("dot");
        $(redCircle).addClass("redCircle");
        $("#redChestCircle").append(redCircle);

        startReps();
    }, 4500);
};

function startReps(){
    let startTime = {
                        "questionID": curQuestion["id"],
                        "startTime": Date.now()
                    };

    start_reps(startTime);
};

function clickChest(){
    $("#redChestCircle").click(function () {
        clickTime = {
                        "questionID": curQuestion["id"],
                        "clickTime": Date.now()
                     };

        click_chest(clickTime);
    });
};

function verifyChest(){
    let questionInfo = {
                        "questionID": curQuestion["id"],
                        "topic": curQuestion["topic"]
                        };

    verify_chest(questionInfo);
};

$(document).ready(function(){
    $("#quiznav").addClass("active");

    // Progress bar logic
    
    $("#dot" + curQuestion["id"]).addClass("currentQuestion")

    if (curQuestion["id"] != 4) {
            let nextQuestionNum = parseInt(curQuestion["id"]) + 1
            let nextQues = "/quiz/" + nextQuestionNum
            $("#nextQuestion").attr("href", nextQues)

            $("#nextText").text("Next question")
        } else{
            $("#nextQuestion").attr("href", "/quizend")

            $("#nextText").text("Finish quiz")
    }

    if (curQuestion["id"] != 1) {
            let previousQuestionNum = parseInt(curQuestion["id"]) - 1
            $("#dot" + previousQuestionNum).removeClass("currentQuestion")
        } else{
    }

    get_circles()

    // Transition logic

    $("#nextQuestion").addClass("isDisabled")
    $("#reviewMaterialQuiz").attr("href", "/learn/" + curQuestion["topic"])

    // Chest logic
    startChest()
    clickChest()
})