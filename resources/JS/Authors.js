$(document).ready(function() {
  let authorsM = new Map();
  let toDelete = null;
  getAuthors(authorsM).done(fillTable);

  $("#addAuthor").click(function() {
    addAuthor($("#authorName").val());
  });

  $("#deleteAuthor").click(function() {
    if (toDelete != null) {
      deleteAuthor(authorsM.get(parseInt(toDelete)).authorId);
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
//<td><input type="checkbox" id='checkbox${counter}' name="options[]" value="1"></input></td>
function fillTable(authors) {
  const tableBody = document.getElementById("authors");
  authorsM = this.custom;
  let authorsHtml = "";
  var counter = 1;
  for (let author of authors) {
    authorsHtml += `<tr>
    <td>${author.name}</td><td><a id="${counter}" href="#deleteAuthorModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>`;
    authorsM.set(counter, author);
    counter++;
  }
  tableBody.innerHTML = authorsHtml;
}
function addAuthor(authorName) {
  var author = {
    name: authorName
  };
  const url = "http://localhost:8080/api/v1/testrandomizer/authors";
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(author),
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
function deleteAuthor(authorId) {
  const url = "http://localhost:8080/api/v1/testrandomizer/authors/" + authorId;
  $.ajax({
    url: url,
    type: "DELETE",
    success: function(result) {
      toDelete = null;
    }
  });
}
