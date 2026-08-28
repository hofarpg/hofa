jQuery(function ($) {
  if (!$('.mbmembers').length) {
    return;
  }

  // 1) Remover miembros y cosas que no dependen de $.get
  $('.mbmembers .mbmember:has(".mbmci-name a[href="/u1"], .mbmci-name a[href="/u2"], .mbmci-name a[href="/u3"]")').remove();

  var directorytitle = $(document).prop('title').replace('Miembros', 'Directorio').trim();
  $(document).prop('title', directorytitle);

  $('.mfilt-censo').find('li:not(:first-child)').append('<span class="filter-count"></span>');

  $('.mbm-filtgroup strong').click(function () {
    $(this).parents('.mbm-filtgroup').toggleClass('showfilters');
  });

  // 2) Preparar procesamiento de miembros con $.get
  var $links = $(".mbmci-name a");
  var pending = $links.length;

  if (pending === 0) {
    initIsotopeAndCounts();
    return;
  }

  $links.each(function () {
    var $link = $(this);
    var memberlistuser = $link.attr("href");

    $.get(memberlistuser, function (data) {
      var $member = $link.parents(".mbmember");

      var memberank = $(data).find(".pfctrank>span").html();
      $member.find(".mbm-weap").append(memberank);

      var memberparent = $(data)
        .find('.pcfield .pclabel span:contains("Ascendencia")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");
      $member.find(".mbmci-desc>div>span").append(memberparent);

      var memberlvl = $(data)
        .find('.pcfield .pclabel span:contains("Nivel")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");

      var memberfc = $(data)
        .find('.pcfield .pclabel span:contains("Face claim")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");
      $member.find(".mbm-fc").append(memberfc);

      var memberserv = $(data)
        .find('.pcfield .pclabel span:contains("Servicio")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");
      $member.find(".mbm-serv").append(memberserv);

      var memberofic = $(data)
        .find('.pcfield .pclabel span:contains("Oficio")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");
      $member.find(".mbm-ofic").append(memberofic);

      var memberuser = $(data)
        .find('.pcfield .pclabel span:contains("Alias del usuario")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");
      $member.find(".mbm-user").append(memberuser);

      var memberbday = $(data)
        .find('.pcfield .pclabel span:contains("Fecha de nacimiento")')
        .parents(".pcfield")
        .find(".pccontent .field_uneditable");
      $member.find(".mbm-naci").append(memberbday);

      var memberbaul = $(data)
        .find("#field_id13 .field_uneditable a")
        .attr("href");
      $member
        .find(".membau")
        .html(
          '<a href="' +
            memberbaul +
            '" target="_blank"><i class="fa-regular fa-suitcase" title="Baúl"></i></a>'
        );

      var memberbusper = $(data)
        .find("#field_id14 .field_uneditable a")
        .attr("href");
      $member
        .find(".membpj")
        .html(
          '<a href="' +
            memberbusper +
            '" target="_blank"><i class="fa-regular fa-fingerprint" title="Búsqueda de Personajes"></i></a>'
        );

      var memberbustra = $(data)
        .find("#field_id15 .field_uneditable a")
        .attr("href");
      $member
        .find(".membtr")
        .html(
          '<a href="' +
            memberbustra +
            '" target="_blank"><i class="fa-regular fa-address-book" title="Búsqueda de Tramas"></i></a>'
        );

      var levl = $member
        .find(".mbm-lvl .field_uneditable")
        .text()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (levl) $member.addClass("n-" + levl);

      var weap = $member
        .find(".mbm-weap")
        .text()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (weap) $member.addClass("c-" + weap);

      var ofic = $member
        .find(".mbm-ofic .field_uneditable")
        .text()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (ofic) $member.addClass("o-" + ofic);

      var user = $member
        .find(".mbm-user .field_uneditable")
        .text()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (user) $member.addClass("u-" + user);

      $member.filter(".u-nombre").removeClass("u-nombre");
      $member.find(".field_uneditable:contains(-)").text("Desconocido");

      // 3) Cuando termina un $.get, decrementamos pending
      pending--;

      if (pending === 0) {
        initIsotopeAndCounts();
      }
    }).fail(function (xhr, status, err) {
      pending--;
      if (pending === 0) {
        initIsotopeAndCounts();
      }
    });
  });

  // 4) Función que inicializa Isotope y filter counts
  function initIsotopeAndCounts() {
    // === AUTOMATIC ALIAS ADDITIONS BY LUX (moved here, after all members are processed) ===
    var members = []; // this is the array of names
    var membersNS = []; // this is the array of names without spaces

    $(".mbmember").each(function () {
      var member = $(this).find(".mbm-user div.field_uneditable").text().trim().toLowerCase();
      var memberArray = member.split(" ");
      var memberNS = ""; // set an empty variable for now

      if (member != "" && member != "administrador" && member != "nombre") {
        // if the member alias isn't empty nor an admin, run the loop
        for (var i = 0; i < memberArray.length; i++) {
          // for each word in the member's alias, add the word to the empty variable so that it's a version without spaces
          memberNS = memberNS + memberArray[i];
        }
        if (jQuery.inArray(member, members) == -1) {
          // if it's not a duplicate, add the version WITH spaces to the members array for the label text
          members.push(member);
        }
        if (jQuery.inArray(memberNS, membersNS) == -1) {
          // same as above, but the no space version to the array to be used for data filter calls
          membersNS.push(memberNS);
        }
      }
    });

    // for each member in the array, add them to the html inside the filtergroup with a class of mfilt-user
    for (var i = 0; i < members.length; i++) {
      if (members[i] != undefined) {
        $('.mfilt-user').append('<li class="abc"><a href="#" data-filter-value=".u-' + membersNS[i] + '">' + members[i] + '</a></li>');
      }
    }

    // ordenar usuarios por orden alfabético
    $(".mfilt-user li.abc").sort(asc_sort).appendTo(".mfilt-user");
    function asc_sort(a, b) {
      return $(b).text() < $(a).text() ? 1 : -1;
    }
    // === END AUTOMATIC ALIAS ADDITIONS ===

    var $container = $(".mbmembers");
    var filters = {};
    var activeClass = "selected";
    var exclClass = "exclusive";

    var $grid = $container.isotope({
      itemSelector: ".mbmember",
      layoutMode: "fitRows",
      filter: ".mbmember:not(.c-staff)",
      percentPosition: false,
      getSortData: {
        nombre: function (itemElem) {
          return $(itemElem)
            .find(".mbmci-name strong")
            .text()
            .trim()
            .toLowerCase();
        },
        fc: function (itemElem) {
          return $(itemElem)
            .find(".mbm-fc .field_uneditable")
            .text()
            .trim()
            .toLowerCase();
        },
        ascendencia: function (itemElem) {
          return $(itemElem)
            .find(".mbmci-desc .field_uneditable")
            .text()
            .trim()
            .toLowerCase();
        },
        clase: function (itemElem) {
          return $(itemElem).find(".mbm-weap").text().trim().toLowerCase();
        },
        oficio: function (itemElem) {
          return $(itemElem).find(".mbm-ofic .field_uneditable").text().trim().toLowerCase();
        }
      },
    });

    $grid.isotope("layout");
    updateFilterCounts();

    // eventos de filtros
    $(".filter.option-set a").click(function (e) {
      var $this = $(this);
      var filterAttr = "data-filter-value";
      var filterValue = $this.attr(filterAttr);
      var $optionSet = $this.parents(".option-set");
      var group = $optionSet.attr("data-filter-group");
      var filterGroup = filters[group];
      if (!filterGroup) {
        filterGroup = filters[group] = [];
      }
      var $selectAll = $optionSet.find("a[" + filterAttr + '=""]');

      comboFiltering(
        $this,
        filters,
        filterAttr,
        filterValue,
        $optionSet,
        group,
        $selectAll,
        activeClass,
        exclClass
      );

      var comboFilter = getComboFilter(filters);
      $grid.isotope({
        filter: comboFilter,
      });

      updateFilterCounts();
      $this.toggleClass(activeClass);
      e.preventDefault();
    });

    function updateFilterCounts() {
      var itemElems = $container.isotope("getFilteredItemElements");
      var $itemElems = $(itemElems);

      $(".filter.option-set a").each(function (i, a) {
        var $label = $(a);
        var filterValue = $label.attr("data-filter-value");
        if (!filterValue) {
          return;
        }
        var count = $itemElems.filter(filterValue).length;
        $label.parent().find(".filter-count").text(count);
      });
    }

    function comboFiltering(
      $this,
      filters,
      filterAttr,
      filterValue,
      $optionSet,
      group,
      $selectAll,
      activeClass,
      exclClass
    ) {
      if (!$optionSet.hasClass(exclClass)) {
        if (!$this.hasClass(activeClass) && filterValue.length) {
          filters[group].push(filterValue);
          $selectAll.removeClass(activeClass);
        } else if (filterValue.length) {
          var curIndex = filters[group].indexOf(filterValue);
          if (curIndex > -1) filters[group].splice(curIndex, 1);
          if (!$optionSet.find("a." + activeClass).not($this).length)
            $selectAll.addClass(activeClass);
        } else {
          $optionSet.find("a." + activeClass).removeClass(activeClass);
          filters[group] = [];
        }
      } else {
        if (!$this.hasClass(activeClass) && filterValue.length) {
          $optionSet.find("a." + activeClass).each(function (k, filterLink) {
            var removeFilter = $(filterLink).attr(filterAttr);
            var removeIndex = filters[group].indexOf(removeFilter);
            filters[group].splice(removeIndex, 1);
          });
          filters[group].push(filterValue);
          $optionSet.find("a." + activeClass).removeClass(activeClass);
        } else if (filterValue.length) {
          var curIndex = filters[group].indexOf(filterValue);
          if (curIndex > -1) filters[group].splice(curIndex, 1);
          if (!$optionSet.find("a." + activeClass).not($this).length)
            $selectAll.addClass(activeClass);
        } else {
          $optionSet.find("a." + activeClass).removeClass(activeClass);
          filters[group] = [];
        }
      }
    }

    function getComboFilter(filters) {
      var i = 0;
      var comboFilters = [];
      for (var prop in filters) {
        var filterGroup = filters[prop];
        if (!filterGroup.length) {
          continue;
        }
        if (i === 0) {
          comboFilters = filterGroup.slice(0);
        } else {
          var filterSelectors = [];
          var groupCombo = comboFilters.slice(0);
          for (var k = 0, len3 = filterGroup.length; k < len3; k++) {
            for (var j = 0, len2 = groupCombo.length; j < len2; j++) {
              filterSelectors.push(groupCombo[j] + filterGroup[k]);
            }
          }
          comboFilters = filterSelectors;
        }
        i++;
      }
      var comboFilter = comboFilters.join(", ");
      return comboFilter;
    }

    // bind sort label click
    $(".sort.option-set a").click(function (e) {
      var sortByValue = $(this).attr("data-sort-value");
      $grid.isotope({ sortBy: sortByValue });
      $(this)
        .parents(".sort")
        .find("." + activeClass)
        .removeClass(activeClass);
      $(this).addClass(activeClass);
      e.preventDefault();
    });
  }
});
