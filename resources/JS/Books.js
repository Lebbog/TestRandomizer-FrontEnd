$(document).ready(function() {
  getBooks().done(fillTable);
  let toDelete = null;
  $("#addBook").click(function() {
    addBook($("#bookTitle").val(), $("#authorId").val());
  });
  $("#deleteBook").click(function() {
    if (toDelete != null) {
      deleteBook(toDelete);
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

function getBooks() {
  const url = "http://localhost:8080/api/v1/testrandomizer/books";
  return $.ajax({
    url: url,
    type: "GET"
  });
}
//<td><input type="checkbox" id='checkbox${counter}' title="options[]" value="1"></input></td>
function fillTable(books) {
  const tableBody = document.getElementById("books");
  let booksHtml = "";
  var counter = 1;
  for (let book of books) {
    booksHtml += `<tr>
    <td>${book.bookId}</td><td>${book.title}</td><td>${book.authorId}</td><td><a href="#deleteBookModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>`;
    counter++;
  }
  tableBody.innerHTML = booksHtml;
}
function addBook(booktitle, authorId) {
  var book = {
    title: booktitle
  };
  const url = "http://localhost:8080/api/v1/testrandomizer/authors/" + authorId + "/books";
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(book),
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
function deleteBook(bookId) {
  const url = "http://localhost:8080/api/v1/testrandomizer/books/" + bookId;
  $.ajax({
    url: url,
    type: "DELETE",
    success: function(result) {
      toDelete = null;
    }
  });
}
