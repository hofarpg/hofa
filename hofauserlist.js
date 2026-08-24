/* Automatic alias additions by LUX */
$(function () {
  var members = [];
  var membersNS = [];
  $(".mbmember").each(function () {
    var membercontent = $(this)
      .find(".mbm-user div.field_uneditable")
      .first();
    if (!membercontent.length) {
      console.warn("No se encontró el nombre del miembro:", this);
      return;
    }
    var member = membercontent
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (!member) {
      return;
    }
    var memberNS = member.replace(/\s/g, "");
    if (members.indexOf(member) === -1) {
      members.push(member);
      membersNS.push(memberNS);
    }
    $(this).addClass(memberNS);
  });
  for (var i = 0; i < members.length; i++) {
    var userdatafilter = $("<a>", {
      href: "#",
      "data-filter-value": ".u-" + membersNS[i],
      text: members[i]
    });
    var userdataelement = $("<li>", {
      class: "abc"
    }).append(userdatafilter);
    $(".mfilt-user").append(userdataelement);
  }
  /* darle orden alfabético */
  $(".mfilt-user li.abc")
    .sort(function (a, b) {
      return $(a).text().localeCompare($(b).text());
    })
    .appendTo(".mfilt-user");
});
