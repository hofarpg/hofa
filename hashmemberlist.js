$(() => {
  if (!$(".mbmembers").length) {
    return;
  }

  /* obtener miembros por nombre */
  var $memberlistpjname = $(".mbmci-name a");
  var pending = $memberlistpjname.length;

  if (pending === 0) {
    initIsotopeAndUserList();
    return;
  }

  $memberlistpjname.each(function () {
    var $link = $(this);
    var memberlistuser = $link.attr("href");

    $.get(memberlistuser, function (data) {
      var $member = $link.parents(".mbmember");

      /* obtener y llenar información de campos */
      var memberank = $(data).find(".pfctrank>span").html();
      $member.find(".mbm-weap").append(memberank);

      var memberparent = $(data).find('.pcfield .pclabel span:contains("Ascendencia")').parents(".pcfield").find(".pccontent .field_uneditable");
      $member.find(".mbmci-desc>div>span").append(memberparent);

      var memberfc = $(data).find('.pcfield .pclabel span:contains("Face claim")').parents(".pcfield").find(".pccontent .field_uneditable");
      $member.find(".mbm-fc").append(memberfc);

      var memberserv = $(data).find('.pcfield .pclabel span:contains("Servicio")').parents(".pcfield").find(".pccontent .field_uneditable");
      $member.find(".mbm-serv").append(memberserv);

      var memberofic = $(data).find('.pcfield .pclabel span:contains("Oficio")').parents(".pcfield").find(".pccontent .field_uneditable");
      $member.find(".mbm-ofic").append(memberofic);

      var memberuser = $(data).find('.pcfield .pclabel span:contains("Alias del usuario")').parents(".pcfield").find(".pccontent .field_uneditable");
      $member.find(".mbm-user").append(memberuser);

      var memberbday = $(data).find('.pcfield .pclabel span:contains("Fecha de nacimiento")').parents(".pcfield").find(".pccontent .field_uneditable");
      $member.find(".mbm-naci").append(memberbday);

      /* obtener y llenar links */
      var memberbaul = $(data).find("#field_id13 .field_uneditable a").attr("href");
      $member.find(".membau").html('<a href="' + memberbaul +'" target="_blank"><i class="fa-regular fa-suitcase" title="Baúl"></i></a>');

      var memberbusper = $(data).find("#field_id14 .field_uneditable a").attr("href");
      $member.find(".membpj").html('<a href="' + memberbusper + '" target="_blank"><i class="fa-regular fa-fingerprint" title="Búsqueda de Personajes"></i></a>');

      var memberbustra = $(data).find("#field_id15 .field_uneditable a").attr("href");
      $member.find(".membtr").html('<a href="' + memberbustra + '" target="_blank"><i class="fa-regular fa-address-book" title="Búsqueda de Tramas"></i></a>');

      /* obtener y llenar clases */      
      var asc = $member.find(".mbmci-desc div span").text().trim().toLowerCase().replace(/\s+/g, "-") .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (asc) $member.addClass("a-" + asc);
      
      var weap = $member.find(".mbm-weap").text().trim().toLowerCase().replace(/\s+/g, "-") .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (weap) $member.addClass("c-" + weap);

      var ofic = $member.find(".mbm-ofic .field_uneditable").text().trim().toLowerCase().replace(/\s+/g, "-") .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (ofic) $member.addClass("o-" + ofic);

      var user = $member.find(".mbm-user .field_uneditable").text().trim().toLowerCase().replace(/\s+/g, "-") .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (user) $member.addClass("u-" + user);

      /* remover clase de .u-nombre */
      $member.filter(".u-nombre").removeClass("u-nombre");

      /* rellenar campos sin información */
      $member.find(".field_uneditable:contains(  -)").text("Desconocido");

      pending--;

      if (pending === 0) {
        initIsotopeAndUserList();
      }
    }).fail(function (xhr, status, err) {
      pending--;
      if (pending === 0) {
        initIsotopeAndUserList();
      }
    });
  });

  /* inicializar isotope y user list */
  function initIsotopeAndUserList() {
    
    /* automatic alias additions by LUX */
    var members = []; // this is the array of names
    var membersNS = []; // this is the array of names without spaces

    $(".mbmember").each(function () {
      var member = $(this).find(".mbm-user div.field_uneditable").text().trim().toLowerCase();
      var memberArray = member.split(" ");
      var memberNS = ""; // set an empty variable for now

      if (member != "" && member != "nombre") {
        // if the member alias isn't empty nor the default, run the loop
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
        $(".mfilt-user").append(
          '<li class="abc"><a href="#" data-filter-value=".u-' +
            membersNS[i] +
            '">' +
            members[i] +
            "</a></li>",
        );
      }
    }

    /* ordenar usuarios por orden alfabético */
    $(".mfilt-user li.abc").sort(asc_sort).appendTo(".mfilt-user");
    function asc_sort(a, b) {
      return $(b).text() < $(a).text() ? 1 : -1;
    }
    
    /* calcular edad de personaje */
    var perfil = ".mbmember";
    var psfield = ".flex.fcolumn";
    var pscontent = ".field_uneditable";
    var psnacimiento = ".mbm-naci";
    var psfieldEnganche = ".mbm-age";

    $(psnacimiento).each(function () {
      getAge(this, pscontent, month, year);
    });

    function getAge(psfield, pscontent, month, year) {
      var string = $(psfield).find(pscontent).text();
      var fecha = string.split("/");
      var age = year - fecha[2];
      if (fecha[1] > month) {
        age--;
      }
      if (isNaN(age)) {
        age = "Desconocida";
      }
      $(psfield).parents(perfil).find(psfieldEnganche).html(age);
    }
    
    /* sistema de filtrado */
    var $container = $(".mbmembers"); // the container with all the elements to filter inside
    var filters = {}; //should be outside the scope of the filtering function
    var activeClass = "selected"; // the class for active links
    var exclClass = "exclusive"; // the class for exclusive groups
    var $filterButtonGroup = $(".filter.option-set a"); // the filtering buttons

    /* --- read the documentation on isotope.metafizzy.co for more options --- */
    var $grid = $container.isotope({
      itemSelector: ".mbmember", // the elements to filter
      layoutMode: "fitRows", 
      percentPosition: false, // put true if you use percentage widths, otherwise put false
      getSortData: {
        nombre: function (itemElem) {
          return $(itemElem).find(".mbmci-name strong").text().trim().toLowerCase();
        },
        fc: function (itemElem) {
          return $(itemElem).find(".mbm-fc .field_uneditable").text().trim().toLowerCase();
        },
        ascendencia: function (itemElem) {
          return $(itemElem).find(".mbmci-desc .field_uneditable").text().trim().toLowerCase();
        },
        clase: function (itemElem) {
          return $(itemElem).find(".mbm-weap").text().trim().toLowerCase();
        },
        oficio: function (itemElem) {
          return $(itemElem).find(".mbm-ofic .field_uneditable").text().trim().toLowerCase();
        },
      },
    });
    
    // layout after full initialization
    $grid.isotope("layout");
    
    // generate filter count
    updateFilterCounts();
    
    // bind filter a click
    $filterButtonGroup.click(function (e) {
      e.preventDefault();
      var $this = $(this); // cache the clicked link
      var filterAttr = "data-filter-value";
      var filterValue = $this.attr(filterAttr); // cache the filter
      var $optionSet = $this.parents(".option-set"); // cache the parent element
      var group = $optionSet.attr("data-filter-group"); // cache the parent filter group 
      var filterGroup = filters[group];
      
      if (!filterGroup) {
        filterGroup = filters[group] = [];
      }
      
      var $selectAll = $optionSet.find("a[" + filterAttr + '=""]'); // the 'select all' button in the current group
    
      // manage dynamic exclusve and inclusive combo filters        
      var isExclusive = $optionSet.hasClass(exclClass);
      var hasActive = $this.hasClass(activeClass);
      
      if (!isExclusive) {
        if (!hasActive && filterValue.length) {
          filters[group].push(filterValue);
        } else if (filterValue.length) {
          var curIndex = filters[group].indexOf(filterValue);
          if (curIndex > -1) filters[group].splice(curIndex, 1);
        } else {
          filters[group] = [];
        }
      } else {
        if (!hasActive && filterValue.length) {
          filters[group] = [filterValue];
        } else {
          filters[group] = [];
        }
      }
      
      // generate combo filters from function
      var comboFilter = getComboFilter(filters);
      
      // generate hash url from filters
      var currentSort = getHashParam("sort") || "original-order";
      location.hash = 'filter=' + encodeURIComponent(comboFilter || "*") + '&sort=' + currentSort;
    });
    
    // add filter count 
    function updateFilterCounts() {
      // get filtered item elements
      var itemElems = $container.isotope("getFilteredItemElements");
      var $itemElems = $(itemElems);
    
      $filterButtonGroup.each(function (i, a) {
        var $label = $(a);
        var filterValue = $label.attr('data-filter-value');
        if (!filterValue) return; // do not update 'any' buttons
        
        var count = $itemElems.filter(filterValue).length;
        var $countSpan = $label.parent().find('.filter-count');
        if ($countSpan.length) {
          $countSpan.text(count);
        } else {
          $label.parent().append('<span class="filter-count">' + count + '</span>');
        }
      });
    }
    
    // create combo filter fuction
    function getComboFilter(filters) {
      var comboFilters = [];
      var firstGroup = true;
    
      for (var prop in filters) {
        var filterGroup = filters[prop];
        if (!filterGroup || !filterGroup.length) continue;
    
        if (firstGroup) {
          comboFilters = filterGroup.slice(0);
          firstGroup = false;
        } else {
          var filterSelectors = [];
          for (var k = 0; k < filterGroup.length; k++) {
            for (var j = 0; j < comboFilters.length; j++) {
              filterSelectors.push(comboFilters[j] + filterGroup[k]);
            }
          }
          comboFilters = filterSelectors;
        }
      }
      return comboFilters.join(", ");
    }
    
    // Hash filtering
    function getHashParam(param) {
      var matches = location.hash.match(new RegExp(param + '=([^&]+)', 'i'));
      return matches ? decodeURIComponent(matches[1]) : null;
    }
    function onHashchange() {
      var hashFilter = getHashParam("filter");
      var hashSort = getHashParam("sort") || "original-order";      
      
      $grid.isotope({ 
        filter: hashFilter || "*",
        sortBy: hashSort
      });
      
      // Remove all active selected class
      $filterButtonGroup.removeClass(activeClass);
      $(".sort.option-set a").removeClass(activeClass);
      
      filters = {};
      
      // Sync filter button visual states
      if (hashFilter && hashFilter !== "*") {
        $filterButtonGroup.each(function() {
          var $button = $(this);
          var val = $button.attr('data-filter-value');
          
          if (val && hashFilter.indexOf(val) !== -1) {
            $button.addClass(activeClass);
            
            var group = $button.parents(".option-set").attr("data-filter-group");
            if (!filters[group]) filters[group] = [];
            if (filters[group].indexOf(val) === -1) {
              filters[group].push(val);
            }
          }
        });        
        // Add selected class to buttons
        $(".filter.option-set").each(function() {
          var $set = $(this);
          if ($set.find("a." + activeClass).length) {
            $set.find('a[data-filter-value=""]').removeClass(activeClass);
          } else {
            $set.find('a[data-filter-value=""]').addClass(activeClass);
          }
        });       
      } else {
        $(".filter.option-set").each(function() {
          $(this).find('a[data-filter-value=""]').addClass(activeClass);
        });
        filters = {}; 
      }
      
      // Sync sort button visual states
      var $activeSortButton = $(".sort.option-set a[data-sort-value='" + hashSort + "']");
      if ($activeSortButton.length) {
        $activeSortButton.addClass(activeClass);
      } else {
        $(".sort.option-set a[data-sort-value='original-order']").addClass(activeClass);
      }
      
      updateFilterCounts();
    }    
    $(window).on('hashchange', onHashchange);
    
    onHashchange();
    
    // bind sort a click
    $(".sort.option-set a").click(function (e) {
      e.preventDefault();
      var sortByValue = $(this).attr("data-sort-value") || "original-order";
      var currentFilter = getHashParam("filter") || "*";
      location.hash = 'filter=' + encodeURIComponent(currentFilter) + '&sort=' + sortByValue;
    });
    
  }
  
});
