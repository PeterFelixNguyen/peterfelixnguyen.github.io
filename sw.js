/* Author: Peter "Felix" Nguyen */
/* Serve the site 404 page when Porkbun/OpenResty returns a generic 404. */

var CACHE_NAME = "peterfelixnguyen-404-v2";
var NOT_FOUND_URL = "/404.html";

function serve404() {
  return caches.match(NOT_FOUND_URL).then(function(cached) {
    if (cached) {
      return cached;
    }
    return fetch(NOT_FOUND_URL);
  });
}

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.add(NOT_FOUND_URL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") {
    return;
  }
  if (event.request.mode !== "navigate" && event.request.destination !== "document") {
    return;
  }

  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response.status === 404) {
        return serve404();
      }
      return response;
    }).catch(function() {
      return serve404();
    })
  );
});
