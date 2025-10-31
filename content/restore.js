(function (exports) {
  const TAG = 'TRIPLING-INTERVAL  ';

  let timeoutId;

  const setTriplingInterval = (callback, interval) => {
    timeoutId = setTimeout(() => {
      callback();
      setTriplingInterval(callback, interval * 3);
    }, interval);
  };

  const clearTriplingInterval = () => {
    window.clearTimeout(timeoutId);
  };

  exports.triplingInterval = {
    set: setTriplingInterval,
    clear: clearTriplingInterval,
  };
})(this);

(async function (exports) {
  'use strict';
  const TAG = 'RESTORE  ';

  const url = location.href;

  const getRange = (position) => {
    const container = document.querySelector(position.selector);
    if (!container) return;
    const range = document.createRange();
    const textNode = container.childNodes[position.nodeIndex];
    range.setStart(textNode, position.offset);
    range.setEnd(textNode, position.offset + 1);
    return range;
  };

  const moveRuleUntilLoad = (range) => {
    triplingInterval.set(showRule.bind(this, range), 10);
    window.onload = () => {
      showRule(range);
      triplingInterval.clear();
    };
  };

  const result = await browser.storage.sync.get(url);
  const position = result[url];
  if (!position) return;

  const init = () => {
    const range = getRange(position);
    const top = showRule(range);
    window.scrollTo(0, top - window.innerHeight / 3);
    moveRuleUntilLoad(range);
  };

  if (document.readyState === 'interactive') init();
  else document.addEventListener('DOMContentLoaded', init);
})(this);
