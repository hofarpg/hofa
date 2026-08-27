/* automatic alias additions by LUX */
$(() => {
	setTimeout(function(){
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
	  });
	  //for each member in the array, add them to the html inside the filtergroup with a class of mfilt-user
	  for (var i = 0; i < members.length; i++) {
	      if (members[i] != undefined) {	  
	           $('.mfilt-user').append('<li class="abc"><a href="#" data-filter-value=".u-' + membersNS[i] + '">' + members[i] + '</a></li>');
	      }
	  }	  
	  //ordenar usuarios por orden alfabético
	  $(".mfilt-user li.abc").sort(asc_sort).appendTo(".mfilt-user");
	  function asc_sort(a, b) {
	    return $(b).text() < $(a).text() ? 1 : -1;
	  }  
	}, 1000);
});

/* sistema de filtrado */
$(() => {	
	setTimeout(function(){   
		 var $container = $(".mbmembers"); // the container with all the elements to filter inside
		 var filters = {}; //should be outside the scope of the filtering function
		 var activeClass = "selected", // the class for active links
			 exclClass = "exclusive"; // the class for exclusive groups
		
		 /* --- read the documentation on isotope.metafizzy.co for more options --- */
		 var $grid = $container.isotope({
		   itemSelector: ".mbmember", // the elements to filter
		   layoutMode: 'fitRows',
		   filter: '.mbmember:not(.c-staff)',
		   percentPosition: false, // put true if you use percentage widths, otherwise put false
		   getSortData: {
	    		  nombre: function(itemElem) {
	    			return $(itemElem).find('.mbmci-name strong').text().trim().toLowerCase();
	    		  },
	    		  fc: function(itemElem) {
	    			return $(itemElem).find('.mbm-fc .field_uneditable').text().trim().toLowerCase();
	    		  },
	    		  ascendencia: function(itemElem) {
	    			return $(itemElem).find('.mbmci-desc .field_uneditable').text().trim().toLowerCase();
	    		  },
	    		  clase: function(itemElem) {
	    			return $(itemElem).find('.mbm-weap').text().trim().toLowerCase();
	    		  },
		   },
		 });
		
		// layout after full initialization
		$grid.isotope('layout');
			
		// generate filter count
		updateFilterCounts();
		
		 $(".filter.option-set a").click(function(e) {
		   var $this = $(this); // cache the clicked link
		   var filterAttr = "data-filter-value";
		   var filterValue = $this.attr(filterAttr); // cache the filter
		   var $optionSet = $this.parents(".option-set"); // cache the parent element
		   var group = $optionSet.attr("data-filter-group"); // cache the parent filter group 
		   var filterGroup = filters[group];
		   if (!filterGroup) {
			 filterGroup = filters[group] = []; 
		   }
		   var $selectAll = $optionSet.find('a['+filterAttr+'=""]'); // the 'select all' button in the current group
		   comboFiltering($this, filters, filterAttr, filterValue, $optionSet, group, $selectAll, activeClass, exclClass);
		   var comboFilter = getComboFilter(filters);
		   $grid.isotope({
			 filter: comboFilter
		   }); 
		   updateFilterCounts();
		   $this.toggleClass(activeClass);		
		   e.preventDefault();
		 });
			
	    // add filter count 
	    function updateFilterCounts()  {
	        // get filtered item elements
	        var itemElems = $container.isotope('getFilteredItemElements');
	        var $itemElems = $(itemElems);
	        $filterButtons.each( function(i, a) {
	            var $label = $(a);
	            var filterValue = $label.attr('data-filter-value');
	            if (!filterValue) {
	                // do not update 'any' buttons
	                return;
	            }
	            var count = $itemElems.filter(filterValue).length;
	            $label.parent().find('.filter-count').text(count);
	        });
	    }
		
	    // create combo filter fuction
	    function comboFiltering($this, filters, filterAttr, filterValue, $optionSet, group, $selectAll, activeClass, exclClass) {
	        if (!$optionSet.hasClass(exclClass)) {
	            if (!$this.hasClass(activeClass) &&
	                filterValue.length
	            ) {
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
	                $optionSet.find("a." + activeClass).each(function(k, filterLink) {
	                    var removeFilter = $(filterLink).attr(filterAttr);
	                    var removeIndex = filters[group].indexOf(removeFilter);
	                    filters[group].splice(removeIndex, 1);
	                });
	                filters[group].push(filterValue);
	                $optionSet.find("a." + activeClass).removeClass(activeClass);
	            } else if (filterValue.length) {
	                var curIndex = filters[group].indexOf(filterValue);
	                if (curIndex > -1)
	                    filters[group].splice(curIndex, 1);
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
		$('.sort.option-set a').click(function(e) {
			var sortByValue = $(this).attr('data-sort-value');
			$grid.isotope({sortBy: sortByValue});
			$(this).parents('.sort').find('.' + activeClass).removeClass(activeClass);
			$(this).addClass(activeClass);
			e.preventDefault();
		});
		
	}, 1000);
});
