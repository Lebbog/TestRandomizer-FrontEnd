$(document).ready(function() {
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
    $("#tbl1")
      .find("tr")
      .each(function(i, el) {
        var $tds = $(this).find("td");
        bookId = $tds.eq(0).val();
        Type = $tds.eq(1).val();
        Amount = $tds.eq(2).val();
        console.log(bookId, Type, Amount);
      });
  });
});
