let bookQTypes = new Map();
$(document).ready(function() {
  let booksM = new Map();
  getBookQTypes();
  getBooks(booksM).done(fillBooks);
  // getTypes();
  $("#addQuestion").click(function() {
    $("#testParams").each(function() {
      var tds = "<tr>";
      jQuery.each($("tr:last td", this), function() {
        let $td = $(this).clone();
        let $child = $td.children().eq(0);
        switch ($child.attr("id")) {
          case "types":
          case "amount":
            $child.prop("disabled", true);
            break;
          default:
            break;
        }
        tds += "<td>" + $td.html() + "</td>";
        // tds += "<td>" + $(this).html() + "</td>";
      });
      tds += "</tr>";
      if ($("tbody", this).length > 0) {
        $("tbody", this).append(tds);
      } else {
        $(this).append(tds);
      }
    });
    $(this).prop("disabled", true);
    $("#create").prop("disabled", true);
  });

  // //Disable buttons based on input
  // $(document).on("keyup", ".form-control", function() {
  //   if ($(this).val() == "" || isNaN($(this).val())) {
  //     $("#addQuestion").prop("disabled", true);
  //     $("#create").prop("disabled", true);
  //     if (isNaN($(this).val())) {
  //       alert("Amount must be a number");
  //       $(this).val("");
  //     }
  //   } else {
  //     $("#addQuestion").prop("disabled", false);
  //     $("#create").prop("disabled", false);
  //   }
  // });

  //Disable buttons based on input
  $(document).on("keyup change", ".testInput", function() {
    let id = $(this).attr("id");
    let currentRow = $(this).closest("tr");
    let amount = currentRow.find("#amount");
    let typesDD = currentRow.find("#types");
    switch (id) {
      case "books":
        let book = booksM.get(parseInt($(this).val()));
        let types = bookQTypes.get(book.bookId);
        let typesHtml = ``;

        if (types === undefined) {
          typesHtml = `<option value=N/A>N/A</option>`;
          typesDD.html(typesHtml);
          typesDD.prop("disabled", true);
        } else {
          for (let type of types) {
            typesHtml += `<option value="${type}">${type}</option>`;
          }
          typesDD.html(typesHtml);
          typesDD.prop("disabled", false);
          amount.prop("disabled", false);
        }
        break;
      // case "types":
      //   break;
      case "amount":
        if ($(this).val() == "" || isNaN($(this).val())) {
          if (isNaN($(this).val())) {
            alert("Amount must be a number");
            $(this).val("");
            //return;
          }
        }
        break;
      default:
        break;
    }
    if (!typesDD.is(":disabled") && !amount.is(":disabled") && amount.val()) {
      $("#addQuestion").prop("disabled", false);
      $("#create").prop("disabled", false);
    } else {
      $("#addQuestion").prop("disabled", true);
      $("#create").prop("disabled", true);
    }
    // $("#addQuestion").prop("disabled", false);
    // $("#create").prop("disabled", false);

    // $("#addQuestion").prop("disabled", true);
    // $("#create").prop("disabled", true);
  });

  $("#testParams").on("click", "button", function(e) {
    if ($("#testParams tr").length == 1) return;
    $(this)
      .closest("tr")
      .remove();
    $("#addQuestion").prop("disabled", false);
    $("#create").prop("disabled", false);
  });

  $("#numTests").keyup(function() {
    if (isNaN($(this).val())) {
      alert("Amount must be a number");
      $(this).val("");
    }
  });

  // $("#books").change(function() {
  //   let book = booksM.get(parseInt($(this).val()));
  //   let currentRow = $(this).closest("tr");
  //   let types = bookQTypes.get(book.bookId);
  //   let typesDD = currentRow.find("#types");
  //   let typesHtml = ``;

  //   if (types === undefined) {
  //     typesHtml = `<option value=N/A>N/A</option>`;
  //     typesDD.html(typesHtml);
  //     typesDD.prop("disabled", true);
  //   } else {
  //     for (let type of types) {
  //       typesHtml += `<option value="${type}">${type}</option>`;
  //     }
  //     typesDD.html(typesHtml);
  //     typesDD.prop("disabled", false);
  //   }
  // });

  $("#create").click(function() {
    let numTests = null;
    if ($("#numTests").val() && !$("#numTests").val() == "") {
      numTests = $("#numTests").val();
    }
    if (numTests == null) {
      alert("Number of tests cannot be empty!");
      return;
    }
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
      if (!currentRow.find("#amount").val()) {
        currentRow.find("#amount").val(1);
        col3_value = 1;
      }
      amounts.push(col3_value);
    });
    let endPoint = "http://localhost:8080/api/v1/testrandomizer/questions/specific";

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
    //console.log(endPoint);
    getTests(endPoint);
  });

  $("#downloadTests").click(function() {
    downloadTests();
  });
});
var folder = null;
var folderZip = null;
function fillBooks(books) {
  booksM = this.custom;
  const dropDown = document.getElementById("books");
  let booksHtml = "";
  booksHtml += `<option disabled selected value>--Select Book--</option>`;
  var counter = 1;
  for (let book of books) {
    if (bookQTypes.get(book.bookId)) {
      booksHtml += `<option value="${counter}">${book.title + " - " + book.authorName}</option>`;
      booksM.set(counter, book);
      counter++;
    }
  }
  dropDown.innerHTML = booksHtml;
}

//Generic type  fill
function fillTypes(types) {
  const dropDown = document.getElementById("types");
  let typesHtml = "";
  // typesHtml += `<option disabled selected value> -- select an option -- </option>`;
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

//generic get for all kinds of types
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
//Types per book
function getBookQTypes() {
  const url = "http://localhost:8080/api/v1/testrandomizer/books/questionTypes";
  return $.ajax({
    url: url,
    type: "GET",
    success: function(json_data, textStatus, jqXHR) {
      for (let bookType of json_data) {
        bookQTypes.set(bookType.bookId, bookType.questionTypes);
      }
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
  $("#links").empty();
  $("#links").append("<h5>Test Links:</h5>");
  let zip = new JSZip();
  let testsFolder = zip.folder("tests");
  let counter = 1;
  for (let test of tests) {
    let testText = "";
    let testName = "Test" + counter;
    let preHtml = `<html><head><title>${testName}</title></head><body>`;
    let innerHtml = ``;
    for (let question of test) {
      testText += question.value + "\n";
      innerHtml += `<p>${question.value}</p>`;
    }
    let postHtml = `</body></html>`;
    let html = preHtml + innerHtml + postHtml;
    let blob = new Blob(["\ufeff", html], {
      type: "text/html"
    });

    //provide links so each test can be viewed in browser
    let url = (URL || webkitURL).createObjectURL(blob);
    $("#links").append(`<a href="${url}" target="_blank">${testName.replace(" ", "") + " "}</a>`);

    //Add to zip
    let filename = testName + ".doc";
    testsFolder.file(filename, blob);
    counter++;
  }
  folderZip = zip;
  folder = testsFolder;
  $("#links").show();
  $("#downloadTests").show();
  location.href = "#downloadTests";
}
// let counter = 1;
// for (let test of tests) {
//   let testText = "";
//   let testName = "test " + counter;
//   let preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${testName}</title></head><body>`;
//   let innerHtml = ``;
//   for (let question of test) {
//     testText += question.value + "\n";
//     innerHtml += `<p>${question.value}</p>`;
//   }
//   let postHtml = `</body></html>`;
//   let html = preHtml + innerHtml + postHtml;
//   let blob = new Blob(["\ufeff", html], {
//     type: "application/msword"
//   });
//   var downloadLink = document.createElement("a");
//   document.body.appendChild(downloadLink);
//   let url = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);
//   let filename = testName + ".doc";
//   if (navigator.msSaveOrOpenBlob) {
//     navigator.msSaveOrOpenBlob(blob, filename);
//   } else {
//     downloadLink.href = url;
//     downloadLink.download = filename;
//     downloadLink.click();
//   }
//   counter++;
// }
function downloadTests() {
  if (folder != null) {
    folderZip.generateAsync({ type: "blob" }).then(function(folder) {
      saveAs(folder, "tests.zip");
    });
    // location.reload();
  }
}
