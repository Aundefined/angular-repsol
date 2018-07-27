(function() {
  $(document).ready(function() {
    
    
    // Desplegable basico
    if($('.rps-select').length > 0){
      $('.rps-select').niceSelect();
      
      $('.nice-select .list .option').click(function () {
        var dataValue = $(this).attr("data-value")
        
        //$(this).parent().css("height", listAlto+"px")
        
        if(dataValue == "inactive"){
          return false;
        }
        $(this).parents(".rps-pestanias").find(".tab-pane").removeClass("active");
        $(this).parents(".rps-pestanias").find(".tab-pane").removeClass("in");
        $(this).parents(".rps-pestanias").find('#'+dataValue).addClass("active");
        $(this).parents(".rps-pestanias").find('#'+dataValue).addClass("in");
        $(this).parents(".rps-pestanias").find(".nav-tabs li").removeClass("active");
        $(this).parents(".rps-pestanias").find("[aria-controls='"+dataValue+"']").parent().addClass("active");
      })
    }
    
    //Desplegable con autocompletado
    if($(".rps-autocomplete").length > 0){
      comboAutocomplete(".rps-autocomplete");
    }
    
    
    //Desplegable con multiseleccion
    if($(".rps-multiSelect").length > 0) {
      $('.rps-multiSelect').multiselect({
        maxHeight: 400,
        enableClickableOptGroups: true,
        buttonWidth: '100%',
        onInitialized: function (select, container) {
          alert('Initialized.');
        },
        buttonText: function (options, select) {
          var dataIni = select.attr("data-ini");
          var dataMore = select.attr("data-more");
      
          if (options.length === 0) {
            return dataIni;
          } else if (options.length > 3) {
            return options.length + " " + dataMore;
          }
          else {
            var labels = [];
            options.each(function () {
              if ($(this).attr('label') !== undefined) {
                labels.push($(this).attr('label'));
              }
              else {
                labels.push($(this).html());
              }
            });
            return labels.join(', ') + '';
          }
        }
      });
    }
  });
}());

function comboAutocomplete(selector) {
  
  var optionActive = "";
  
  $.widget("custom.combobox", {
    _create: function() {
      this.wrapper = $("<span>")
      .addClass("custom-combobox")
      .insertAfter(this.element);
      
      this.element.hide();
      this._createAutocomplete();
      this._createShowAllButton();
    },
    
    _createAutocomplete: function() {
      var selected = this.element.children(":selected"),
        value = selected.val() ? selected.text() : "";
      
      this.input = $("<input>")
      .appendTo(this.wrapper)
      .val(value)
      .attr("title", "")
      .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
      .autocomplete({
        delay: 0,
        minLength: 0,
        source: $.proxy(this, "_source"),
        appendTo: this.wrapper
      })
      
      this._on(this.input, {
        autocompleteselect: function(event, ui) {
          optionActive = ui.item.value;

          ui.item.option.selected = true;
          this._trigger("select", event, {
            item: ui.item.option
          });
          this.element.val(ui.item.option.value);
          this.element.change();
        },
        
        autocompletechange: "_removeIfInvalid"
      });
    },
    
    _createShowAllButton: function() {
      var input = this.input,
        wasOpen = false,
        isClick = false;
      
      $("<a>")
      .attr("tabIndex", -1)
      .attr("title", "Show All Items")
      .appendTo(this.wrapper)
      .button({
        icons: {
          primary: "ui-icon-triangle-1-s"
        },
        text: false
      })
      .removeClass("ui-corner-all")
      .addClass("custom-combobox-toggle ui-corner-right")
      .on("mousedown", function() {
        wasOpen = input.autocomplete("widget").is(":visible");
        
      })
      .on("click", function() {
        input.trigger("focus");
        isClick = true;
        
        // Close if already visible
        if (wasOpen) {
          input.parent().removeClass("open");
          return;
        }else{
          input.parent().addClass("open");
        }
        
        // Pass empty string as value to search for, displaying all results
        input.autocomplete("search", "");
        if(optionActive != ""){
          
          var list = $(this).parent().find("li");
          for (var i = 0; i < list.length; i++) {
            var element = list[i];
            var listText = $(element).children().text();
            if(optionActive === listText) {
              $(element).children().addClass("active");
            }
          }
        }
        
      });
      $(document).click(function () {
        if(!isClick){
          input.parent().removeClass("open");
        }
        isClick = false;
      });
      
    },
    
    _source: function(request, response) {
      var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
      response(this.element.children("option").map(function() {
        var text = $(this).text();
        if (this.value && (!request.term || matcher.test(text)))
          return {
            label: text,
            value: text,
            option: this
          };
      }));
    },
    
    _removeIfInvalid: function(event, ui) {
      
      // Selected an item, nothing to do
      if (ui.item) {
        return;
      }
      
      // Search for a match (case-insensitive)
      var value = this.input.val(),
        valueLowerCase = value.toLowerCase(),
        valid = false;
      this.element.children("option").each(function() {
        if ($(this).text().toLowerCase() === valueLowerCase) {
          this.selected = valid = true;
          return false;
        }
      });
      
      // Found a match, nothing to do
      if (valid) {
        return;
      }
      
      // Remove invalid value
      this.input
      .val("")
      .attr("title", value + " didn't match any item")
      this.element.val("");
      this.input.autocomplete("instance").term = "";
    },
    
    _destroy: function() {
      this.wrapper.remove();
      this.element.show();
    }
    
  });
  
  $(selector).combobox();
  
}
