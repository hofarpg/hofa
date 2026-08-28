console.log('ARCHIVO EXTERNO: inicio');

$(() => {
  console.log('ARCHIVO EXTERNO: dentro del ready');

  $(
    '.mbmembers .mbmember:has(".mbmci-name a[href="/u1"], .mbmci-name a[href="/u2"], .mbmci-name a[href="/u3"]")',
  ).remove();

  /* Title de la página */
  var directorytitle = $(document)
    .prop("title")
    .replace("Miembros", "Directorio")
    .trim();
  $(document).prop("title", directorytitle);

  /* Añade filter count a los filtros */
  $(".mfilt-censo")
    .find("li:not(:first-child)")
    .append('<span class="filter-count"></span>');

  /* Toggle de categorias */
  $(".mbm-filtgroup strong").click(function () {
    $(this).parents(".mbm-filtgroup").toggleClass("showfilters");
  });
  /* llenar campos y asignar clases */
  $(".mbmci-name a").each(function () {
    var memberlistuser = $(this).attr("href");
    var self = $(this);
    $.get(memberlistuser, function (data) {
      var $member = $(self).parents(".mbmember");
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
      /*$member.find('.mbm-lvl').append(memberlvl);*/
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
            '" target="_blank"><i class="fa-regular fa-suitcase" title="Baúl"></i></a>',
        );
      var memberbusper = $(data)
        .find("#field_id14 .field_uneditable a")
        .attr("href");
      $member
        .find(".membpj")
        .html(
          '<a href="' +
            memberbusper +
            '" target="_blank"><i class="fa-regular fa-fingerprint" title="Búsqueda de Personajes"></i></a>',
        );
      var memberbustra = $(data)
        .find("#field_id15 .field_uneditable a")
        .attr("href");
      $member
        .find(".membtr")
        .html(
          '<a href="' +
            memberbustra +
            '" target="_blank"><i class="fa-regular fa-address-book" title="Búsqueda de Tramas"></i></a>',
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
      /*$member.filter(".u-administrador").remove();*/
      $member.filter(".u-nombre").removeClass("u-nombre");
      $member.find(".field_uneditable:contains(-)").text("Desconocido");

      /* calcular edad después de insertar la fecha de nacimiento */
      getAge(month, year);
      function getAge(month, year) {
        var string = $member.find(".mbm-naci").find(".field_uneditable").text();
        var fecha = string.split("/");
        var age = year - fecha[2];
        if (fecha[1] > month) {
          age--;
        }
        if (isNaN(age)) {
          var age = "Desconocida";
        }
        $member.find(".mbm-age").html(age);
      }
    });
  });

  /* sistema de filtrado */
  var $container = $(".mbmembers"); // the container with all the elements to filter inside
  var filters = {}; //should be outside the scope of the filtering function
  var activeClass = "selected", // the class for active links
    exclClass = "exclusive"; // the class for exclusive groups

  /* --- read the documentation on isotope.metafizzy.co for more options --- */
  var $grid = $container.isotope({
    itemSelector: ".mbmember", // the elements to filter
    layoutMode: "fitRows",
    filter: ".mbmember:not(.c-staff)",
    percentPosition: false, // put true if you use percentage widths, otherwise put false
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
    },
  });

  // layout after full initialization
  $grid.isotope("layout");

  // generate filter count
  updateFilterCounts();

  $(".filter.option-set a").click(function (e) {
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
    comboFiltering(
      $this,
      filters,
      filterAttr,
      filterValue,
      $optionSet,
      group,
      $selectAll,
      activeClass,
      exclClass,
    );
    var comboFilter = getComboFilter(filters);
    $grid.isotope({
      filter: comboFilter,
    });
    updateFilterCounts();
    $this.toggleClass(activeClass);
    e.preventDefault();
  });

  // add filter count
  function updateFilterCounts() {
    // get filtered item elements
    var itemElems = $container.isotope("getFilteredItemElements");
    var $itemElems = $(itemElems);
    $(".filter.option-set a").each(function (i, a) {
      var $label = $(a);
      var filterValue = $label.attr("data-filter-value");
      if (!filterValue) {
        // do not update 'any' buttons
        return;
      }
      var count = $itemElems.filter(filterValue).length;
      $label.parent().find(".filter-count").text(count);
    });
  }

  // create combo filter fuction
  function comboFiltering(
    $this,
    filters,
    filterAttr,
    filterValue,
    $optionSet,
    group,
    $selectAll,
    activeClass,
    exclClass,
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
});
