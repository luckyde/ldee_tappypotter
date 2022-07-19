/*!
* FitText.js 1.0 jQuery free version
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
* Modified by Slawomir Kolodziej http://slawekk.info
*
* Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
*/ (function() {
    var addEvent = function(el, type, fn) {
        if (el.addEventListener) el.addEventListener(type, fn, false);
        else el.attachEvent('on' + type, fn);
    };
    var extend = function(obj, ext) {
        for(var key in ext)if (ext.hasOwnProperty(key)) obj[key] = ext[key];
        return obj;
    };
    window.fitText = function(el1, kompressor, options) {
        var settings = extend({
            'minFontSize': -1 / 0,
            'maxFontSize': 1 / 0
        }, options);
        var fit = function(el) {
            var compressor = kompressor || 1;
            var resizer = function() {
                el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
            };
            // Call once to set.
            resizer();
            // Bind events
            // If you have any js library which support Events, replace this part
            // and remove addEvent function (or use original jQuery version)
            addEvent(window, 'resize', resizer);
            addEvent(window, 'orientationchange', resizer);
        };
        if (el1.length) for(var i = 0; i < el1.length; i++)fit(el1[i]);
        else fit(el1);
        // return set of elements
        return el1;
    };
})();

//# sourceMappingURL=index.98bed70f.js.map
