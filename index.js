$(function () {

    var source = "";

    let showRacks = function (racks) {
        $("#bingos").html('');
        racks.map(rack => {
            $("#bingos").append(`<li>${rack.rack}: <span class="answer d-none">${rack.words}</span></li>`);
        });
        $("#bingos li").on("click", function (evt) {
            $(evt.currentTarget).find(".answer").toggleClass("d-none");
        });
    }

    $("#startBtn").on("click", function () {

        var count = 120;

        var counter = setInterval(timer, 1000);
        function timer() {
            count = count - 1;
            $("#timer").html("Time left: " + count + " secs");
            if (count <= 0) {
                clearInterval(counter);
                alert("you are out. Please start again.");
                location.reload();
                // $(".title").removeClass("d-none");
                //$("#content").addClass("d-none");
                return;
            }
        }
        $("#content").removeClass("d-none");

        $("#startBtn").attr("disabled", true);

        function makeid() {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            return characters.charAt(Math.floor(Math.random() * characters.length));
        }

        for (var i = 0; i < 6; i++) {
            var letter = makeid();
            source += letter;
            $("#select").append(letter);
        }
    });

    $('#reset').click(function() {
        location.reload();
    });

    $("#guess").on('keypress', function (evt) {
        
        function isNumeric(t) {
            var regex = /\d/g;
            return regex.test(t);
        }
        if (evt.which == 13) {
            evt.preventDefault();
            if (isNumeric(evt.currentTarget.value)) {
                alert('Please enter only letters.');
            }
            else
                $("#guessWord").append(evt.currentTarget.value.toUpperCase()).append("<br>");

            //alert(evt.currentTarget.value);
            $("#guess").val("");
            return false;
        }
    });

    $("#grabmore").on("click", function () {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/text-twist/api.php",
            success: data => { showRacks(data) }
        });
    });

});
