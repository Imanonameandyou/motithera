// Theme loaders – load jQuery and Swiper on demand (no global load).
// Must be included in <head> without defer so sections can call these before body finishes parsing.

(function () {
  "use strict";

  window.jqueryCheckAndLoad = function () {
    if (window.jqueryCustomLoad) return Promise.resolve(window.jQuery);
    if (typeof window.jQuery !== "undefined") {
      window.jqueryCustomLoad = true;
      return Promise.resolve(window.jQuery);
    }
    window.jqueryCustomLoad = true;
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      s.onload = function () {
        resolve(window.jQuery);
      };
      s.onerror = function () {
        resolve(null);
      };
      document.head.appendChild(s);
    });
  };

  window.swiperCheckAndLoad = function () {
    if (window.swiperCustomLoad && typeof window.Swiper !== "undefined") {
      return Promise.resolve();
    }
    if (window.swiperLoadPromise) return window.swiperLoadPromise;
    window.swiperCustomLoad = true;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
    document.head.appendChild(link);
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
    window.swiperLoadPromise = new Promise(function (resolve) {
      script.onload = function () {
        resolve();
      };
      script.onerror = function () {
        resolve();
      };
    });
    document.head.appendChild(script);
    return window.swiperLoadPromise;
  };
})();
