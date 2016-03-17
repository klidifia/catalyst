(function(){
    "use strict";

    var ua = navigator.userAgent;
    window.is_iOS = ua.match(/(iPad|iPhone|iPod)/gi) ? true : false;
    window.is_android = ua.match(/android/i) ? true : false;

    var loading_timer;

    var init = function(){
        FastClick.attach(document.body);
        enhance_jquery_attr();
        init_language();
        $("#network_problems").click(network_problems_off);
        $(document).keyup(on_key_up);
    };

    var on_key_up = function(event){
        switch(event.which){
            case 39: //right
                $(document).trigger("swiperight");
                break;
            case 37: //left
                $(document).trigger("swipeleft");
                break;
        }
    };

    var init_language = function(){
        var default_language = "en",
            language = window.localStorage.getItem(CONSTANTS.localStorage.language) || default_language;
            
        window.set_language(language);
    };

    window.set_language = function(iso_language_code){
        var process_attributes = function(i, element){
            var prefix   = "data-lang-" + iso_language_code + "-",
                $element = $(element),
                attrs    = $element.attr(),
                value,
                attr;

            for(attr in attrs){
                if(attr.length > prefix.length && attr.substr(0, prefix.length) === prefix){
                    value = attrs[attr];
                    $element.attr(attr.substr(prefix.length), value);
                }
            }
            
        };
        switch(iso_language_code){
            case "en":
                $("body").removeClass("lang-mi lang-none").addClass("lang-en");
                $("*[data-lang]").each(process_attributes);
                break;
            case "mi":
                $("body").removeClass("lang-en lang-none").addClass("lang-mi");
                $("*[data-lang]").each(process_attributes);
                break;
            default:
                alert("Error: Unrecognised language code '" + iso_language_code + "'");
                return;
        }
        window._LANGUAGE = iso_language_code;
        window.localStorage.setItem(CONSTANTS.localStorage.language, window._LANGUAGE);
        $(document).trigger("mts:language-change", window._LANGUAGE);
    };

    window.get_language = function(){
        return window._LANGUAGE;
    };

    window.loading_on = function(){
        $("#loading").show();

        if(loading_timer) clearTimeout(loading_timer);
        loading_timer = setTimeout(network_problems_on, CONSTANTS.network_timeout);
    };

    window.network_problems_on = function(){
        $("#loading").hide();
        $("#network_problems").show();
    };

    window.network_problems_off = function(){
        $("#loading").hide();
        $("#network_problems").hide();
        window.router.trigger('hashchange');
    };

    window.loading_off = function(){
        if(loading_timer) clearTimeout(loading_timer);
        $("#loading").hide();
        $("#network_problems").hide();
    };

    window.get_language_string = function(id){
        var language_strings = CONSTANTS.language,
            language_code = window._LANGUAGE;

        if(language_strings[language_code][id]) return language_strings[language_code][id];
        if(language_code !== "en" && language_strings.en[id])
        return "[NO TRANSLATION AVAILABLE]";
    };

    var toggle_language = function(){
        var language = get_language(),
            new_language;
        if(!language) return;
        if(language === "en") {
            new_language = "mi";
        } else {
            new_language = "en";
        }
        set_language(new_language);

        $(document).trigger("mts:language-change", new_language);
    };

    var enhance_jquery_attr = function(){
        (function(old) {
          $.fn.attr = function() {
            if(arguments.length === 0) {
              if(this.length === 0) {
                return null;
              }

              var obj = {};
              $.each(this[0].attributes, function() {
                if(this.specified) {
                  obj[this.name] = this.value;
                }
              });
              return obj;
            }

            return old.apply(this, arguments);
          };
        })($.fn.attr);
    };

    window.staggered_slidedown = function($nodes){
        var _this = {
          counter: 0,
          begin: function($nodes){
            _this.$nodes = $nodes.hide();
            _this.counter = 0;
            setTimeout(_this.next_cycle, 60);
          },
          next_cycle: function(){
            _this.$nodes.eq(_this.counter).slideDown();
            _this.counter++;

            if(_this.counter < _this.$nodes.length){
              setTimeout(_this.next_cycle, 60);
            }
          }
        };
        _this.begin($nodes);
        return _this;
    };
    
    $(document).on("phonegap:ready", init);

}());
