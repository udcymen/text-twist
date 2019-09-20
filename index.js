$(function () {
    var answers = [];

    let start_game = function (data) {

        $("#content").removeClass("d-none");

        for (let i = 0; i < data[0].rack.length; i++) {
            $("#select").append("<text class='mx-3'>" + data[0].rack[i] + "</text>");
        }

        answers = data[0].words;

        var count = 120;
        var counter = setInterval(function () {
            count = count - 1;
            $("#timer").html("Time left: " + count + " secs");
            if (count <= 0) {
                clearInterval(counter);
                $('#scoreMessage').text('Your score is ' + $("#Point-Value").text());
                $('#modalInfotime').modal('toggle');
                $('.reset').click(function () {
                    location.reload();
                });
                return;
            }
        }, 1000);
        $("#Point").append("Scores: <text id='Point-Value'>0</text>");
    }

    $("#startBtn").on("click", function () {
        $("#startBtn").attr("disabled", true);

        $.ajax({
            method: "GET",
            url: "https://banana-pear.herokuapp.com/api.php",
            success: data => { start_game(data) }
        });
    });

    $('#reset').click(function () {
        location.reload();
    });


    $("#guess").on('keypress', function (evt) {
        if (evt.which == 13) {

            let regex = /^[a-zA-Z]*$/;
            let guess = $("#guess").val().toUpperCase();
            if (answers.length == 0) {
                $('#modalInfosucess').modal('toggle');
                $('.reset').click(function () {
                    location.reload();
                });
            }

            if (regex.test(guess)) {
                if (answers.includes(sha256(guess))) {
                    answers.splice(answers.indexOf(sha256(guess)), 1);
                    $("#guessWord").append($("#guess").val().toUpperCase()).append("<br>");
                    $("#Point-Value").text(parseInt($("#Point-Value").text()) + 1)
                    $('#guess').attr("placeholder", answers.length + " words left");
                }
            }
            else {
                alert('Please enter only letters.');
            }

            $("#guess").val("");


            evt.preventDefault();
            return false;
        }

    });


});
