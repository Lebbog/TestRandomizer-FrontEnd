$(document).ready(function() {
  let booksM = new Map();
  getBooks(booksM).done(fillBooks);
  getTypes();

  $("#addQuestion").click(function() {
    $("#testParams").each(function() {
      var tds = "<tr>";
      jQuery.each($("tr:last td", this), function() {
        tds += "<td>" + $(this).html() + "</td>";
      });
      tds += "</tr>";
      if ($("tbody", this).length > 0) {
        $("tbody", this).append(tds);
      } else {
        $(this).append(tds);
      }
    });
  });

  $("#testParams").on("click", "button", function(e) {
    if ($("#testParams tr").length == 1) return;
    $(this)
      .closest("tr")
      .remove();
  });
  $("#create").click(function() {
    let numTests = null;
    if ($("#numTests").val() && !$("#numTests").val() == "") {
      numTests = $("#numTests").val();
    }
    if (numTests == null) alert("Number of tests cannot be empty!");
    let bookIds = [];
    let types = [];
    let amounts = [];
    $("#testParams tr").each(function() {
      var currentRow = $(this);
      var col1_value = currentRow.find("#books").val();
      bookIds.push(booksM.get(parseInt(col1_value)).bookId);
      var col2_value = currentRow.find("#types").val();
      types.push(col2_value);
      var col3_value = currentRow.find("#amount").val();
      amounts.push(col3_value);
    });
    let endPoint = "http://localhost:8080/api/v1/testrandomizer/questions/tests";

    endPoint += "?testAmount=" + numTests;

    for (let idx = 0; idx < bookIds.length; idx++) {
      let bookId = bookIds[idx];
      if (idx == 0) endPoint += `&bookId=`;
      if (idx == bookIds.length - 1) endPoint += `${bookId}`;
      else endPoint += `${bookId},`;
    }
    for (let idx = 0; idx < types.length; idx++) {
      let type = types[idx];
      if (idx == 0) endPoint += `&type=`;
      if (idx == types.length - 1) endPoint += `${type}`;
      else endPoint += `${type},`;
    }
    for (let idx = 0; idx < amounts.length; idx++) {
      let amount = amounts[idx];
      if (idx == 0) endPoint += `&amount=`;
      if (idx == amounts.length - 1) endPoint += `${amount}`;
      else endPoint += `${amount},`;
    }
    console.log(endPoint);
    getTests(endPoint);
  });
});

function fillBooks(books) {
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

function fillTypes(types) {
  const dropDown = document.getElementById("types");
  let typesHtml = "";
  for (let type of types) {
    typesHtml += `<option value="${type}">${type}</option>`;
  }
  dropDown.innerHTML = typesHtml;
}

function getBooks(booksM) {
  const url = "http://localhost:8080/api/v1/testrandomizer/books";
  return $.ajax({
    url: url,
    type: "GET",
    custom: booksM
  });
}

function getTypes() {
  const url = "http://localhost:8080/api/v1/testrandomizer/questions/types";
  return $.ajax({
    url: url,
    type: "GET",
    success: function(json_data, textStatus, jqXHR) {
      fillTypes(json_data);
    },
    error: function(e) {
      console.log(e);
    }
  });
}

function getTests(url) {
  return $.ajax({
    url: url,
    type: "GET",
    success: function(json_data, textStatus, jqXHR) {
      createTests(json_data);
    },
    error: function(e) {
      console.log(e);
    }
  });
}
function createTests(tests) {
  console.log(tests);
}
