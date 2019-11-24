$(document).ready(function() {
  getAuthors().done(fillTable);
  let toDelete = null;
  $("#addAuthor").click(function() {
    addAuthor($("#authorName").val());
  });

  $("#deleteAuthor").click(function() {
    if (toDelete != null) {
      console.log("about to be in delete author");
      deleteAuthor(toDelete);
    }
  });
  // $(document).on("change", ":checkbox", function() {
  //   if (this.checked) {
  //     var row = $(this).closest("tr")[0];
  //     console.log(row.cells[2].innerHTML);
  //   }
  // });
  $(document).on("click", ".delete", function() {
    var row = $(this).closest("tr")[0];
    //console.log(row.cells[2].innerHTML);
    toDelete = row.cells[2].innerHTML;
    deleteAuthor(toDelete);
  });
});

function getAuthors() {
  const url = "http://localhost:8080/api/v1/testrandomizer/authors";
  return $.ajax({
    url: url,
    type: "GET"
  });
}

function fillTable(authors) {
  const tableBody = document.getElementById("authors");
  let authorsHtml = "";
  var counter = 1;
  for (let author of authors) {
    authorsHtml += `<tr><td><input type="checkbox" id='checkbox${counter}' name="options[]" value="1"></input></td>
    <td>${author.name}</td><td>${author.authorId}</td><td><a href="#deleteAuthorModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td></tr>`;
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
    error: function(e) {
      alert("Error!");
      console.log("ERROR: ", e);
    }
  });
}
function deleteAuthor(authorId) {
  console.log("in delete author");
  const url = "/api/v1/testrandomizer/authors/" + authorId;
  console.log(url);
  $.ajax({
    url: url,
    type: "DELETE",
    success: function(result) {
      console.log(result);
      toDelete = null;
    }
  });
}
