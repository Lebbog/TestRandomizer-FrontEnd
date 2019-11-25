$(document).ready(function() {
  getQuestions().done(fillTable);
  let toDelete = null;
  $("#addQuestion").click(function() {
    addQuestion($("#questionValue").val(), $("#questionType").val(), $("#bookId").val());
  });
  $("#deleteQuestion").click(function() {
    if (toDelete != null) {
      deleteQuestion(toDelete);
    }
  });
  $("#cancelDelete").click(function() {
    toDelete = null;
  });
  $(document).on("click", ".delete", function() {
    var row = $(this).closest("tr")[0];
    toDelete = row.cells[0].innerHTML;
  });
});

function getQuestions() {
  const url = "http://localhost:8080/api/v1/testrandomizer/questions";
  return $.ajax({
    url: url,
    type: "GET"
  });
}
//<td><input type="checkbox" id='checkbox${counter}' title="options[]" value="1"></input></td>
function fillTable(questions) {
  const tableBody = document.getElementById("questions");
  let questionsHtml = "";
  var counter = 1;
  for (let question of questions) {
    questionsHtml += `<tr>
    <td>${question.questionId}</td><td>${question.type}</td><td>${question.value}</td><td>${question.bookId}</td><td><a href="#deleteQuestionModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>`;
    counter++;
  }
  tableBody.innerHTML = questionsHtml;
}
function addQuestion(questionValue, type, bookId) {
  var question = {
    type: type,
    value: questionValue
  };
  console.log(question);
  const url = "http://localhost:8080/api/v1/testrandomizer/books/" + bookId + "/questions/";
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(question),
    dataType: "json",
    success: function(data) {
      console.log("Data: " + data);
    },
    error: function(e) {
      alert("Error!");
      console.log("ERROR: ", e);
    }
  });
}
function deleteQuestion(questionId) {
  const url = "http://localhost:8080/api/v1/testrandomizer/questions/" + questionId;
  $.ajax({
    url: url,
    type: "DELETE",
    success: function(result) {
      toDelete = null;
    }
  });
}
