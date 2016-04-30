(function(exports) {
var TAG = 'SHOW-RULE  ';
var px = function(num) {
  return num + 'px';
}

var rules;
exports.showRule = function(range) {
  if (!rules) {
    rules = {};
    for (var tagName of ['leftBox', 'rightBox']) {
      if (rules[tagName] = document.getElementsByTagName(tagName)[0]) continue;
      rules[tagName] = document.createElement(tagName);
      document.body.appendChild(rules[tagName]);
    }
  }
  var wordRect = range.getBoundingClientRect();
  var height = wordRect.height / 2;
  var style = {
    position: 'absolute',
    zIndex: 99999,
    height: px(height),
    boxSizing: 'border-box'
  };
  var border = '3px solid rgba(255, 112, 0, 0.5)';
  var borderRadius = '0.5rem';
  Object.assign(rules.leftBox.style, style, {
    left: 0,
    top: px(window.scrollY + wordRect.top + height),
    width: px(wordRect.left - 1),
    borderBottom: border,
    borderRight: border,
    borderBottomRightRadius: borderRadius,
  });
  Object.assign(rules.rightBox.style, style, {
    left: px(wordRect.left - 4),
    right: 0,
    top: px(window.scrollY + wordRect.top),
    borderTop: border,
    borderLeft: border,
    borderTopLeftRadius: borderRadius
  });
  return wordRect.top;
}

})(this);

