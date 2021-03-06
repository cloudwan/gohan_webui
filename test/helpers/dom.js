require('mock-local-storage');
var jsdom = require('jsdom');
var mockSocket = require('mock-socket');

// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
// get the window object out of the document
var win = doc.defaultView;
// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc;
global.WebSocket = mockSocket.WebSocket;
global.window = win;

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(win);

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
  for (let key in window._core) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
  window.sessionStorage = global.sessionStorage;
  window.localStorage = global.localStorage;
  window.WebSocket = global.WebSocket;
}
