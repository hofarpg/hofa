/* Automatic alias additions by LUX */
$(function () {
  var members = [];
  var membersNS = [];
  $(".mbmember").each(function () {
    var $memberElement = $(this).find(".mbm-user div.field_uneditable").first();
    // Skip this member if the expected name element does not exist
    if (!$memberElement.length) {
      console.warn("Member name element not found:", this);
      return;
    }
    // .text() is safer here because you only need the visible name
    var member = $memberElement.text()
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    // Skip empty names
    if (!member) {
      return;
    }
    // Remove spaces from the name
    var memberNS = member.replace(/\s/g, "");
    // Add the spaced version only once
    if (members.indexOf(member) === -1) {
      members.push(member);
    }
    // Add the no-space version only once
    if (membersNS.indexOf(memberNS) === -1) {
      membersNS.push(memberNS);
    }
    // Add the generated class to the member element
    $(this).addClass(memberNS);
  });
  // Add each member to the filter list
  for (var i = 0; i < members.length; i++) {
    $(".mfilt-user").append(
      $("<li>", {
        class: "abc",
        "data-filter": ".u-" + membersNS[i],
        text: members[i]
      })
    );
  }
  // Sort the generated filters alphabetically
  $(".mfilt-user li.abc")
    .sort(function (a, b) {
      return $(a).text().localeCompare($(b).text());
    })
    .appendTo(".mfilt-user");
});
