/* Author: Peter "Felix" Nguyen */
/* Register the 404 service worker before other site scripts run. */
(function() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").catch(function(error) {
      console.error("Service worker registration failed:", error);
    });
  });
})();
