$(document).ready(function() {
  let booksM = new Map();
  let toDelete = null;
  getQuestions();
  getBooks(booksM).done(fillDropDown);
  $("#addQuestion").click(function() {
    console.log($("#questionValue").val());
    addQuestion($("#questionValue").val(), $("#questionType").val(), $("#books").val(), booksM);
    //addBook($("#bookTitle").val(), $("#authors").val(), authorsM);
  });
  $("#deleteQuestion").click(function() {
    if (toDelete != null) {
      deleteQuestion(questionsM.get(parseInt(toDelete)).questionId);
    }
  });
  $("#cancelDelete").click(function() {
    toDelete = null;
  });
  $(document).on("click", ".delete", function() {
    toDelete = $(this).attr("id");
  });
  $("#searchInput").on("keyup", function() {
    var value = $(this)
      .val()
      .toLowerCase();
    $("#questions tr").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });
});
let questionsJson = null;
var state = {
  querySet: {},
  page: 1,
  rows: 5,
  window: 5
};
var questionsM = new Map();
function getQuestions() {
  const url = "http://localhost:8080/api/v1/testrandomizer/questions";
  return $.ajax({
    url: url,
    type: "GET",
    success: function(json_data, textStatus, jqXHR) {
      state.querySet = json_data;
      questionsJson = json_data;
      fillTable();
    }
  });
}

function fillTable() {
  //var data = pagination(state.querySet, state.page, state.rows);
  const tableBody = document.getElementById("questions");
  let questionsHtml = "";
  var counter = 1;
  //var questions = data.querySet;
  for (let question of questionsJson) {
    questionsHtml += `<tr>
    <td>${question.bookTitle + " - " + question.authorName}</td><td>${question.type}</td><td>${
      question.value
    }</td><td><a id=${counter} href="#deleteQuestionModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>`;
    questionsM.set(counter, question);
    counter++;
  }
  tableBody.innerHTML = questionsHtml;
  var options = {
    sortOpt: false,
    minOptions: 1
  };
  $("#questionsTable").ddTableFilter(options);
  //<td><a id=${counter} href="#deleteQuestionModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td>
  //pageButtons(data.pages);
}
// function pagination(querySet, page, rows) {
//   var trimStart = (page - 1) * rows;
//   var trimEnd = trimStart + rows;

//   var trimmedData = querySet.slice(trimStart, trimEnd);

//   var pages = Math.ceil(querySet.length / rows);
//   return {
//     querySet: trimmedData,
//     pages: pages
//   };
// }
// function pageButtons(pages) {
//   var wrapper = document.getElementById("pagination-wrapper");
//   wrapper.innerHTML = "";
//   var maxLeft = state.page - Math.floor(state.window / 2);
//   var maxRight = state.page + Math.floor(state.window / 2);
//   if (maxLeft < 1) {
//     maxLeft = 1;
//     maxRight = state.window;
//   }
//   if (maxRight > pages) {
//     maxLeft = pages - (state.window - 1);
//     maxRight = pages;
//     if (maxLeft < 1) {
//       maxLeft = 1;
//     }
//   }
//   for (var page = maxLeft; page <= maxRight; page++) {
//     wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`;
//   }
//   if (state.page != 1) {
//     wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` + wrapper.innerHTML;
//   }
//   if (state.page != pages) {
//     wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`;
//   }
//   $(".page").on("click", function() {
//     $("#questions").empty();
//     state.page = Number($(this).val());
//     fillTable();
//   });
// }
function getBooks(booksM) {
  const url = "http://localhost:8080/api/v1/testrandomizer/books";
  return $.ajax({
    url: url,
    type: "GET",
    custom: booksM
  });
}
function fillDropDown(books) {
  booksM = this.custom;
  const dropDown = document.getElementById("books");
  let booksHtml = "";
  var counter = 1;
  for (let book of books) {
    booksHtml += `<option value="${counter}">${book.title + " - " + book.authorName}</option>`;
    booksM.set(counter, book);
    counter++;
  }
  dropDown.innerHTML = booksHtml;
}
function addQuestion(questionValue, type, bookKey, booksM) {
  let book = booksM.get(parseInt(bookKey));
  var question = {
    type: type,
    value: questionValue
  };
  const url = "http://localhost:8080/api/v1/testrandomizer/books/" + book.bookId + "/questions/";
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(question),
    dataType: "json",
    success: function(data) {
      console.log("Data: " + data);
    },
    error: function(xhr, status, error) {
      var err = eval("(" + xhr.responseText + ")");
      alert("Error: " + err.message);
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
