setTimeout(function(){
  /* automatic alias additions by LUX */
  var members = []; //this is the array of names
  var membersNS = []; //this is the array of names without spaces
  $(".mbmember").each(function () {
    var member = $(this).find(".mbm-user div.field_uneditable").text().trim().toLowerCase();
    var memberArray = member.split(" ");
    var memberNS = ""; //set an empty variable for now
    if (member != "" && member != "administrador" && member != "nombre") {
      //if the member alias isn't empty nor an admin, run the loop
      for (var i = 0; i < memberArray.length; i++) {
        //for each word in the member's alias, add the word to the empty variable so that it's a version without spaces
        memberNS = memberNS + memberArray[i];
      }
      if (jQuery.inArray(member, members) == -1) {
        //if it's not a duplicate, add the version WITH spaces to the members array for the label text
        members.push(member);
      }
      if (jQuery.inArray(memberNS, membersNS) == -1) {
        //same as above, but the no space version to the array to be used for data filter calls
        membersNS.push(memberNS);
      }
    }
    $(this).addClass(memberNS);
  });
  //for each member in the array, add them to the html inside the filtergroup with a class of mfilt-user
  for (var i = 0; i < members.length; i++) {
      if (members[i] != undefined) {
  
           $('.mfilt-user').append('<li><a href="#" data-filter-value=".u-' + membersNS[i] + '">' + members[i] + '</a></li>');
      }
  }
  
  /* ordenar usuarios por orden alfabético */
  $(".mfilt-user li").sort(asc_sort).appendTo(".mfilt-user");
  //$("#debug").text("Output:");
  // accending sort
  function asc_sort(a, b) {
    return $(b).text() < $(a).text() ? 1 : -1;
  }  
}, 600);
