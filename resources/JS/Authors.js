$(document).ready(function() {
  //const cors = "https://cors-anywhere.herokuapp.com/";
  const url = "http://localhost:8080/api/v1/testrandomizer/authors";
  $.ajax({
    url: url,
    type: "GET",
    success: function(result) {
      fillTable(result);
    },
    error: function(error) {
      console.log("Error ${error}");
    }
  });
});

function fillTable(authors) {
  const tableBody = document.getElementById("authors");
  let authorsHtml = "";
  for (let author of authors) {
    authorsHtml += `<tr><td>${author.name}</td><td>${author.authorId}</td></tr>`;
  }
  tableBody.innerHTML = authorsHtml;
}
// "authorId": 3,
// "name": "Brutus"
