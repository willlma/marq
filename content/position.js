(function (exports) {
  'use strict';
  const TAG = 'SELECTION  ';

  const url = location.href;

  const getNthOfType = (elem) => {
    const siblings = [].slice.call(elem.parentNode.children);
    for (let i = siblings.length; i--; ) {
      if (siblings[i].localName !== elem.localName)
        [].splice.call(siblings, i, 1);
    }
    const index = [].indexOf.call(siblings, elem) + 1;
    return ':nth-of-type(' + index + ')';
  };

  const getSelector = (elem) => {
    if (elem.nodeType === Node.TEXT_NODE) elem = elem.parentNode;
    const document = elem.ownerDocument;
    if (elem.id && document.getElementById(elem.id) === elem) {
      return '#' + elem.id;
    }

    // Inherently unique by tag name
    const tagName = elem.tagName.toLowerCase();
    if (tagName === 'html' || tagName === 'head' || tagName === 'body')
      return tagName;

    if (!elem.parentNode) console.warn('danger: ' + tagName);

    // We might be able to find a unique class name
    const isUnique = () => {
      try {
        if (document.querySelectorAll(selector).length === 1) return true;
      } catch (e) {}
      return false;
    };

    let selector, matches;
    if (elem.classList.length > 0) {
      for (let i = 0; i < elem.classList.length; i++) {
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
    selector =
      getSelector(elem.parentNode) + ' > ' + tagName + getNthOfType(elem);

    return selector;
  };

  const savePosition = async (range) => {
    const textNode = range.startContainer;
    const container = textNode.parentNode;
    const position = {};
    position[url] = {
      selector: getSelector(container),
      nodeIndex: [].indexOf.call(container.childNodes, textNode),
      offset: range.startOffset,
    };
    await browser.storage.sync.set(position);
  };

  (async function () {
    const range = getSelection().getRangeAt(0);
    await savePosition(range);
    showRule(range);
  })();

  return {
    url: url,
    title: document.title,
  };
})(this);
