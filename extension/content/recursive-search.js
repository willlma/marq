// Assumes string only occurs once
var getContainerElBySearch = function(elem, string) {
  for (var i = elem.children.length; i--;) {
    var child = elem.children[i];
    if (child.textContent.toLowerCase().indexOf(string)!==-1)
      return getContainerElBySearch(child, string);
  }
  return elem;
}



var getContainerElsBySearch = function(string, elem) {
  var fromIndex, more;
  var els = [];
  var getContainerElBySearch = function(string, elem) {
    var result;
    if (!elem) elem = document.body;
    var index = elem.textContent.toLowerCase().indexOf(string, fromIndex);
    if (index===-1) {
      var sib = elem.nextElementSibling;
      if (sib) {
        result = getContainerElBySearch(string, sib);
        return result;
      } else return;
    } else if (elem.firstElementChild) {
      result = getContainerElBySearch(string, elem.firstElementChild);
      // here is there's a result it means that elem 
      if (result) getContainerElBySearch(string, elem, els, index + string.length);
      return result;
    } else {
      els.push(elem);
      return elem;
    }
  }
  getContainerElBySearch(string);
  return els;
}

var getContainerElsBySearch = function(string, elem) {
  'use strict;'
  let fromIndex;
  let els = [];
  if (!elem) elem = document.body;
  let temp = 1000;
  while (temp--) {
    let index = elem.textContent.toLowerCase().indexOf(string, fromIndex);
    if (index===-1) {
      let sib = elem.nextElementSibling;
      if (sib) {
        elem = sib;
        continue;
      } else break;
    } else if (fromIndex > 0) {
      let priorElemLength = 0, priorElemStringLength = 0;
      while (priorElemStringLength < fromIndex) {
        let child = elem.children[priorElemLength];
        let stringLength = child.textContent.length;
      }
    } else if (elem.firstElementChild) {
      elem = elem.firstElementChild;
      continue;
    } else {
      els.push(elem);
      break;
    }
  }
  return els;
}

var getContainerElsBySearch = function(string, elem) {
  'use strict;'
  if (!elem) elem = document.body;
  let elsLength = 0;
  let fromIndex;
  let temp = 100;
  while (fromIndex = elem.textContent.toLowerCase().indexOf(string, fromIndex) && temp--) {
    elsLength++;
  }
  return elsLength;
}

var els = [];
var getContainerElBySearch = function(string, elem) {
  if (!elem) {
    elem = document.body;
    if (els.length)
      var fromIndex = elem.textContent.toLowerCase().indexOf(string) + string.length;
  }
  if (elem.textContent.toLowerCase().indexOf(string, fromIndex)===-1) {
    var sib = elem.nextElementSibling;
    if (sib) return getContainerElBySearch(string, sib);
    else return;
  } else {
    els.some(function(el, i) {
      if (el!==elem.parentNode) return;
      els.splice(i, 1);
      removed = true;
      return true;
    });
    els.push(elem);
    if (fromIndex) {

    }
    else if (elem.firstElementChild) return getContainerElBySearch(string, elem.firstElementChild);
    return elem;
  }
}

var getFirstNode = function() {
  elem = document.body;
  var child;
  while (child = elem.firstChild) {
    elem = child;
  }
  return elem;
}

var next = function(node) {
  while (node) {
    var sibling = node.nextSibling;
//       console.log(TAG+'sibling: '+sibling);
    if (!sibling) {
      node = node.parentNode;
//         console.log(TAG+'no sibling. node = '+node);
      continue;
    }
    while (sibling) {
      /*if (sibling.nodeType!==Node.TEXT_NODE &&
          getComputedStyle(sibling).MozUserSelect==='none') {
        node = sibling;
        continue outer;
      }*/
      node = sibling;
      sibling = sibling.firstChild;
    }
    return node;
  }
  // console.error('did not encounter last node while finding next sibling');
};

var getIndices = function(string) {
  var bodyContent = document.body.textContent.toLowerCase();
  var index = bodyContent.indexOf(string);
  var indices = [index];
  while ((index = bodyContent.indexOf(string, index + string.length)) !== -1) {
    indices.push(index);
  }
  return indices;
}

var getStartElems = function(string) {
  var indices = getIndices(string);
  var elems = [];
  var cumulativeIndex = 0;
  var node = getFirstNode();
  indices.forEach(function(index) {
    while ((cumulativeIndex = cumulativeIndex + node.textContent.length) <= index) {
      node = next(node);
    }
    if (node.nodeType!==Node.ELEMEMENT_NODE) node = node.parentNode;
    elems.push(node);
  });
  return elems;
}

/*var getStartElems = function(indices) {
  var elem = document.body;
  var index = 0;
  var i = 0;
  var tem = 100;
  while (tem--) {
    if (index + elem.length > indices[i]) {
      elem = elem.firstElementChild;
      continue;
    } else {
      index += elem.length;
      elem = elem.nextElementSibling;
    }
  }
}*/

var getStartAndEndElems = function(string, elem) {
  var index = elem.textContent.indexOf(string);
  var cumulativeElementLength = 0;
  var result = [];
  [].some.call(elem.childNodes, function(child, i) {
    cumulativeElementLength += child.textContent.length
    if (cumulativeElementLength > index && !result.length ||
        cumulativeElementLength > index + string.length && result.length)
      result.push(child);
    if (result.length===2) return true;
  });
  return result;
}