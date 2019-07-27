$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyBBQsUX8Jpuh8AE7fu4NNBHapNRSgmDhEQ",
        authDomain: "train-schedule-ef467.firebaseapp.com",
        databaseURL: "https://train-schedule-ef467.firebaseio.com",
        projectId: "train-schedule-ef467",
        storageBucket: "train-schedule-ef467.appspot.com",
        messagingSenderId: "872273090484",
        appId: "1:872273090484:web:17865926c20f8b12"
    };

    firebase.initializeApp(config);

    var database = firebase.database();


    $("#submitbutton").on("click", function () {
        event.preventDefault();

        var newTrain = $("#trainname").val().trim();
        var destination = $("#destination").val().trim();
        var trainFrequency = $("#frequency").val().trim();
        console.log("trainFrequency: " + trainFrequency);
        var trainTime = $("#traintime").val().trim();
        console.log("traintime: " + trainTime);
        var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
        console.log(trainTimeConverted);
        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));
        var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
        console.log("Time Difference: " + diffTime);
        var tRemainder = diffTime % trainFrequency;
        console.log("Time Remaining: " + tRemainder);
        var minutesAway = trainFrequency - tRemainder;
        console.log("Minutes Till Arrival: " + minutesAway);
        var nextArrival = moment().add(minutesAway, "minutes");
        console.log("Arrival Time: " + moment(nextArrival).format("hh:mm"));

        database.ref().push({
            newTrain: newTrain,
            destination: destination,
            trainFrequency: trainFrequency,
            trainTime: trainTime,
            minutesAway: minutesAway,
            nextArrival: moment(nextArrival).format("hh:mm")
        });

        $("#trainname").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#traintime").val("");
    });

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val().newTrain);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().trainFrequency);
        console.log(childSnapshot.val().trainTime);

        var newRow = $('<tr>');

        $(newRow).append("<td class='trainname'>" + childSnapshot.val().newTrain +
            " </td><td>" + childSnapshot.val().destination +
            " </td><td>" + childSnapshot.val().trainFrequency +
            " </td><td>" + childSnapshot.val().nextArrival +
            " </td><td>" + childSnapshot.val().minutesAway +
            " </td>");

        $("tbody").append(newRow);
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        $("#trainname").html(snapshot.val().trainname); 
        $("#destination").html(snapshot.val().destination);
        $("#frequency").html(snapshot.val().frequency);
        $("#traintime").html(snapshot.val().traintime);
    });
});