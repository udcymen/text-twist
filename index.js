$(function () {
    let showRacks = function (racks) {
        $("#bingos").html('');
        racks.map(rack => {
            $("#bingos").append(`<li>${rack.rack}: <span class="answer d-none">${rack.words}</span></li>`);
        });
        $("#bingos li").on("click", function (evt) {
            $(evt.currentTarget).find(".answer").toggleClass("d-none");
        });
    }

    $("#grabmore").on("click", function () {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/text-twist/api.php",
            success: data=>{ showRacks(data)}
        });
    });
});