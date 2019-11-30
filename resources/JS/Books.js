$(document).ready(function() {
  let authorsM = new Map();
  let booksM = new Map();
  let toDelete = null;
  getBooks(booksM).done(fillTable); //Populate book of tables
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
function getAuthors(authorsM) {
  const url = "http://localhost:8080/api/v1/testrandomizer/authors";
  return $.ajax({
    url: url,
    type: "GET",
    custom: authorsM
  });
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
function getBooks(booksM) {
  const url = "http://localhost:8080/api/v1/testrandomizer/books";
  return $.ajax({
    url: url,
    type: "GET",
    custom: booksM
  });
}
function fillTable(books) {
  booksM = this.custom;
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
