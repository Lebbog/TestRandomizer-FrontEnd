$(document).ready(function() {
  getAuthors().done(fillTable);

  $("#addAuthor").click(function() {
    addAuthor($("#authorName").val());
  });

  $(document).on("change", ":checkbox", function() {
    if (this.checked) {
      var row = $(this).closest("tr")[0];
      console.log(row.cells[2].innerHTML);
    }
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
    authorsHtml += ` <tr><td><input type="checkbox" id='checkbox${counter}' name="options[]" value="1"></input></td>
    <td>${author.name}</td><td>${author.authorId}</td></tr>`;
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
