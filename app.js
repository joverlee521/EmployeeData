// Initialize Firebase
var config = {
    apiKey: "AIzaSyDlU0rIB-TSrskOZmsAZz9eerk84WoImrY",
    authDomain: "employee-data-82993.firebaseapp.com",
    databaseURL: "https://employee-data-82993.firebaseio.com",
    projectId: "employee-data-82993",
    storageBucket: "",
    messagingSenderId: "641456381099"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var name;
  var role;
  var startDate;
  var monthlyRate;
  var monthsWorked;
  var totalBilled;
  var now = moment().format("YYYYMMDD");

  $("#submit-button").on("click", function (){
        event.preventDefault();
        name = $("#employee-name").val().trim();
        role = $("#role").val().trim();
        startDate = $("#start-date").val();
        monthlyRate = $("#monthly-rate").val().trim();
        database.ref().push({
            firebaseName: name,
            firebaseRole: role,
            firebaseStartDate: startDate,
            firebaseMonthlyRate: monthlyRate
        })
  })

  function calmonthsworked(date){
    var duration = Math.floor(moment(now).diff(moment(date), "months"));
    return duration;
  }

  function editData(){
    var spans = document.getElementsByTagName("td"),
    index,
    span;

    for (index = 0; index < spans.length; ++index) {
    span = spans[index];
    if (span.contentEditable) {
        span.onblur = function() {
            var text = this.innerHTML;
            text = text.replace(/&/g, "&amp").replace(/</g, "&lt;");
            console.log("Content committed, span " +
                    (this.id || "anonymous") +
                    ": '" +
                    text + "'");
        };
    }
}
  }

  function display(data){
    var newKey = data.key;
    var newRow = $("<tr>");
    var newName = $("<td>").text(data.val().firebaseName);
    var newRole = $("<td>").text(data.val().firebaseRole);
    var newStartDate = $("<td>").text(data.val().firebaseStartDate);
    var newMonthlyRate = $("<td>").text(data.val().firebaseMonthlyRate);
    var newMonthsWorked = $("<td>").text(calmonthsworked(data.val().firebaseStartDate)); 
    var newTotalBilled = $("<td>").text(parseInt(data.val().firebaseMonthlyRate) * calmonthsworked(data.val().firebaseStartDate));
    var deleteButton = $("<button>").text("Delete"); 
    deleteButton.addClass("my-2 delete-button");
    newStartDate.addClass("true");
    newRow.append(newName, newRole, newStartDate, newMonthsWorked, newMonthlyRate, newTotalBilled, deleteButton);
    $("td").attr("contenteditable", "true");
    deleteButton.attr("data-key", newKey);
    newRow.attr("id", newKey);
    $("tbody").append(newRow);  
    editData();  
  }

  database.ref().on("child_added", function(data){
      display(data);
  })

  
$(document).on("click",".delete-button", function(){
    var thisKey = $(this).attr("data-key");
    database.ref().child(thisKey).remove();
    $("#" + thisKey).remove();
})

