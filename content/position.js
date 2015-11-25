(function(exports, onMessage, storage) {
'use strict';
var TAG = 'SELECTION  ';

var url = location.href;

var getNthOfType = function(elem) {
  var siblings = [].slice.call(elem.parentNode.children);
  for (let i = siblings.length; i--;) {
    if (siblings[i].localName !== elem.localName)
      [].splice.call(siblings, i, 1);
  }
  var index = [].indexOf.call(siblings, elem) + 1;
  return ':nth-of-type(' + index + ')';
};

var getSelector = function(elem) {
  if (elem.nodeType===Node.TEXT_NODE) elem = elem.parentNode;
  var document = elem.ownerDocument;
  if (elem.id && document.getElementById(elem.id) === elem) {
    return '#' + elem.id;
  }

  // Inherently unique by tag name
  var tagName = elem.tagName.toLowerCase();
  if (tagName==='html' || tagName==='head' || tagName==='body')
    return tagName;

  if (!elem.parentNode) console.warn('danger: ' + tagName);

  // We might be able to find a unique class name
  var isUnique = function() {
    try {
      if (document.querySelectorAll(selector).length===1) return true;
    } catch (e) {}
    return false;
  };

  var selector, matches;
  if (elem.classList.length > 0) {
    for (var i = 0; i < elem.classList.length; i++) {
      // Is this className unique by itself?
      selector = '.' + elem.classList.item(i);
      if (isUnique()) return selector;
      // Maybe it's unique with a tag name?
      selector = tagName + selector;
      if (isUnique()) return selector;
      // Maybe it's unique using a tag name and nth-child
      selector = selector + getNthOfType(elem);
      if (isUnique()) return selector;
    }
  }

  // So we can be unique w.r.t. our parent, and use recursion
  selector = getSelector(elem.parentNode) + ' > ' + tagName + getNthOfType(elem);

  return selector;
};
var getLocation = function(textNode) {
  var parent = textNode.parentNode,
      nodeIndex = [].indexOf.call(parent.childNodes, textNode);
};

var savePosition = function(range) {
  var range = window.getSelection().getRangeAt(0);
  var textNode = range.startContainer; 
  var container = textNode.parentNode;
  var position = {};
  position[url] = {
    selector: getSelector(container),
    nodeIndex: [].indexOf.call(container.childNodes, textNode),
    offset: range.startOffset
  };
  storage.set(position);
};

(function() {
  var range = getSelection().getRangeAt(0);
  savePosition(range);
  showRule(range);
})();

return {
  url: url,
  title: document.title
};

})(this, chrome.runtime.onMessage.addListener, chrome.storage.sync);
