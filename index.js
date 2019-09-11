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
    
    var count = 120;

    var counter = setInterval(timer, 1000);
    function timer() {
        count = count - 1;
        $("#timer").html("Time left: " + count + " secs");
        if (count <= 0) {
            clearInterval(counter);
            alert("you are out.");
            $(".title").removeClass("d-none");
            $("#content").addClass("d-none");
            return;
        }
    }

    $("#startBtn").on("click", function () {
        $(".title").addClass("d-none");
        $("#content").removeClass("d-none");


        function makeid() { 
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            return characters.charAt(Math.floor(Math.random() * characters.length));
        }


        for (var i = 0; i < 5; i++) {
            var letter = makeid();
            source += letter;
            $("#select").append("<span class='mx-3 card'>letter</span>");
        }
    });

    $("#guess").on('keypress', function (evt) {
        if (evt.which == 13) {
            evt.preventDefault();
            alert(evt.currentTarget.value);
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
