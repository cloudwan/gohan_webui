/* global document, navigator */
(function () {
  var supportedBrowserSet = {
    Chrome: 52,
    Firefox: 48,
    Edge: 38,
    Safari: 10
  };
  var userAgent = navigator.userAgent;
  var temp;
  var match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if (/trident/i.test(match[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    return 'IE ' + (temp[1] || '');
  }
  if (match[1] === 'Chrome') {
    temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
    if (temp !== null) return temp.slice(1).join(' ').replace('OPR', 'Opera');
  }
  match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((temp = userAgent.match(/version\/(\d+)/i)) !== null) {
    match.splice(1, 1, temp[1]);
  }
  if (!supportedBrowserSet.hasOwnProperty(match[0]) || supportedBrowserSet[match[0]] > Number(match[1])) {
    var el = document.createElement('div');
    el.className = 'browser-info';
    el.innerHTML = '<div class="alert alert-warning fade in out" role="alert" style="text-align: center;">' +
      '<a data-gohan="close" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
    '<strong>You\'re using an unsupported or outdated browser: </strong>' +
    '<span style="display: inline-block;">Please refer to the list of supported browsers ' +
      '<a href="https://github.com/cloudwan/gohan_webui" target="_blank">here</a></span>' +
      '</div>';
    document.body.appendChild(el);
  }
}());
