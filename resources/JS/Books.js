$(document).ready(function() {
  let authorsM = new Map();
  let booksM = new Map();
  // let booksJson = {};
  var state = {
    querySet: {},
    page: 1,
    rows: 5
  };
  getBooks(booksM, state); //Populate book of tables
  getAuthors(authorsM).done(fillDropDown); //populate dropdown of available authors
  $("#addBook").click(function() {
    addBook($("#bookTitle").val(), $("#authors").val(), authorsM);
  });
  $("#deleteBook").click(function() {
    if (toDelete != null) {
      deleteBook(booksM.get(parseInt(toDelete)).bookId);
    }
  });
  $("#cancelDelete").click(function() {
    toDelete = null;
  });

  $(document).on("click", ".delete", function() {
    toDelete = $(this).attr("id");
  });
});
function getBooks(booksM, state) {
  const url = "http://localhost:8080/api/v1/testrandomizer/books";
  return $.ajax({
    url: url,
    type: "GET",
    success: function(json_data, textStatus, jqXHR) {
      state.querySet = json_data;
      fillTable(json_data, booksM, state);
    }
  });
}

function getAuthors(authorsM) {
  const url = "http://localhost:8080/api/v1/testrandomizer/authors";
  return $.ajax({
    url: url,
    type: "GET",
    custom: authorsM
  });
}
function fillTable(books, booksM, state) {
  const tableBody = document.getElementById("books");
  let booksHtml = "";
  var counter = 1;
  for (let book of books) {
    booksHtml += `<tr>
    <td>${book.title}</td><td>${book.authorName}</td><td><a id="${counter}" href="#deleteBookModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>`;
    booksM.set(counter, book);
    counter++;
  }
  tableBody.innerHTML = booksHtml;
  var options = {
    sortOpt: false,
    minOptions: 1
  };
  $("#booksTable").ddTableFilter(options);
}
function fillDropDown(authors) {
  authorsM = this.custom;
  const dropDown = document.getElementById("authors");
  let authorsHtml = "";
  var counter = 1;
  for (let author of authors) {
    authorsHtml += `<option value="${counter}">${author.name}</option>`;
    authorsM.set(counter, author);
    counter++;
  }
  dropDown.innerHTML = authorsHtml;
}
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
function addBook(booktitle, authorKey, authorsM) {
  let author = authorsM.get(parseInt(authorKey));
  var book = {
    title: booktitle
  };
  const url = "http://localhost:8080/api/v1/testrandomizer/authors/" + author.authorId + "/books";
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(book),
    dataType: "json",
    success: function(data) {
      location.reload();
    },
    error: function(xhr, status, error) {
      var err = eval("(" + xhr.responseText + ")");
      alert("Error: " + err.message);
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
      location.reload();
    }
  });
}
