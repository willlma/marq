(function(exports) {
var TAG = 'SHOW-RULE  ';

var addStyle = function(rule) {
  var style = {
    width: '100vw',
    position: 'absolute',
    borderTop: '5px dotted rgba(100, 100, 100, 0.4)',
    borderBottom: '5px dotted rgba(250, 200, 10, 0.9)',
    zIndex: 99999999
  };
  for (var prop in style) rule.style[prop] = style[prop];
};

exports.showRule = function(range) {
  var rule = document.getElementById('marq-rule');
  if (!rule) {
    rule = document.createElement('div');
    rule.id = 'marq-rule';
    document.body.appendChild(rule);
    addStyle(rule);
  }
  var top = range.getBoundingClientRect().top + window.scrollY;
  rule.style.top = top - 8 + 'px';
  return top;
}; 

})(this);

