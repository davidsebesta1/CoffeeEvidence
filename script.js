$(document).ready(function () {
    $.ajax({
        url: "http://ajax1.lmsoft.cz/procedure.php?cmd=getPeopleList",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("coffee:kafe"));
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: generateButtons,
        error: function () {
            alert("Cannot get data");
        }
    });

    $.ajax({
        url: "http://ajax1.lmsoft.cz/procedure.php?cmd=getTypesList",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("coffee:kafe"));
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: generateSliders,
        error: function () {
            alert("Cannot get data");
        }
    });

    $("#listButton").on("click", showList);

    $("#form").submit(submitForm);
});

function submitForm(event) {
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "http://ajax1.lmsoft.cz/procedure.php?cmd=saveDrinks",
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("coffee:kafe"));
        },
        data: getFormPayload(),
        success: function (data) {
            alert("Sent");
        },
    });
}


function getFormPayload() {
    json = [];

    json.push({ name: "user", required: true, type: "radio", value: $("select").val() });

    let inputs = $("input[type=number]");
    $.each(inputs, function (key, val) {
        json.push({ name: "type[]", required: false, type: "range", value: val.value })
    })

    return $.param(json);
}
function generateButtons(data) {
    $.each(data, function (key, value) {
        $("#users").append("<option value='" + value["ID"] + "'>" + value["name"] + "</option><br>");
    });
}

function generateSliders(data) {
    $.each(data, function (key, value) {
        $("#typesSliders").append("<div class='sliderDiv'><label for='" + "slider" + key + "'>" + value["typ"] + "</label><div class='sliderDiv sliderDivRight'><button class='changeButton' id='" + "slider" + key + "btn" + "'>+</button><button class='changeButton' id='" + "slider" + key + "btnmin" + "'>-</button><input type='number' min='0' max='99999' value='0' class='slider' id='" + "slider" + key + "'></div></div><br>");

        $("#slider" + key + "btn").on("click", function (event) {
            event.preventDefault()
            let input = $("#slider" + key)
            input.val(parseInt(input.val()) + 1)
        });

        $("#slider" + key + "btnmin").on("click", function (event) {
            event.preventDefault()
            let input = $("#slider" + key)
            input.val(parseInt(input.val()) - 1)
        });

        let slider = document.getElementById("slider" + key);
        slider.addEventListener("input", function () {
            document.getElementById("slidertext" + key).innerText = slider.value;
        });

    });
}

function showList(event) {
    event.preventDefault();
    let monthId = parseInt($("#months").val());
    $.ajax({
        url: "http://ajax1.lmsoft.cz/procedure.php?cmd=getSummaryOfDrinks" + (monthId == 0 ? "" : ("&month=" + monthId)),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("coffee:kafe"));
        },
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function (data) {
            $("#table").remove()
            $("body").append("<table id='table'><tr><th>Název</th><th>Jméno</th><th>Počet</th></tr></table>")

            $.each(data, function (key, value) {
                $("#table").append("<tr><td>" + value[0] + "</td><td>" + value[2] + "</td><td>" + value[1] + "</td></tr>");
            });
        },
        error: function () {
            alert("Cannot get data");
        }
    });
}