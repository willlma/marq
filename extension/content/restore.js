(function(exports) {
  var TAG = 'TRIPLING-INTERVAL  ';

  var timeoutId;

  var setTriplingInterval = function(callback, interval) {
    timeoutId = setTimeout(function() {
      callback();
      setTriplingInterval(callback, interval * 3);
    });
  };

  var clearTriplingInterval = function() {
    window.clearTimeout(timeoutId);
  };

  exports.triplingInterval = {
    set: setTriplingInterval,
    clear: clearTriplingInterval
  };

})(this);

(function(exports, storage) {
  'use strict';
  var TAG = 'RESTORE  ';

  var url = location.href;

  var getRange = function(position) {
    var container = document.querySelector(position.selector);
    if (!container) return;
    var range = document.createRange();
    var textNode = container.childNodes[position.nodeIndex];
    range.setStart(textNode, position.offset);
    range.setEnd(textNode, position.offset + 1);
    return range;
  };

  var moveRuleUntilLoad = function(range) {
    triplingInterval.set(showRule.bind(this, range), 10);
    window.onload = function() {
      showRule(range);
      triplingInterval.clear();
    };
  };

  storage.get(url, function(result) {
    var position = result[url];
    if (!position) return;
    var init = function() {
      var range = getRange(position);
      var top = showRule(range);
      window.scrollTo(0, top - window.innerHeight / 3);
      moveRuleUntilLoad(range);
    };
    init = init.bind(this, position);
    if (document.readyState==='interactive') init();
    else document.addEventListener('DOMContentLoaded', init);
  });

})(this, chrome.storage.sync);
