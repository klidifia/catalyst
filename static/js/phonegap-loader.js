(function(){
    "use strict";

    window.init_event_id = "deviceready";
    window.is_phonegap = true;
    if(!window.PhoneGap && !window.cordova && !window.Cordova){
        window.init_event_id = "DOMContentLoaded";
        window.is_phonegap = false;
    }

    // TODO: investigate using the following phonegap/cordova detection
    // if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');


    var has_finalized = false,
        has_deviceready = false,
        scripts = [],
        init = function(){
            has_deviceready = true;
            if(has_finalized) load_scripts();
        },
        load_scripts = function(){
            var script,
                script_element,
                i,
                body_element = document.getElementsByTagName("body")[0],
                load_next_script = function(){
                    if(scripts.length === 0){
                        $(document).trigger("phonegap:ready");
                        return;
                    }
                    script = scripts.shift();
                    if(Array.isArray(script) && script[1] === false && window.is_phonegap === false){
                        return load_next_script();
                    }
                    script_element = document.createElement("script");
                    script_element.setAttribute("src", script);
                    script_element.addEventListener("load", load_next_script, false);
                    script_element.addEventListener("error", load_next_script, false);
                    body_element.appendChild(script_element);
                };
            load_next_script();
        };

    window.phonegap_script_loader = {
        add_scripts: function (new_scripts){
            scripts = scripts.concat(new_scripts);
            return window.phonegap_script_loader;
        },
        finalize: function(){
            has_finalized = true;
            if(has_deviceready) load_scripts();
            return window.phonegap_script_loader;
        }
    };

    document.addEventListener(window.init_event_id, init, false);

}());