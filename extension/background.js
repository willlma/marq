(function(exports, onInstalled, contextMenus, tabs, bookmarks, storage) {


'use strict';
const TAG = "BACKGROUND.js  ";


var baseURL = "http://localhost:3000";
var ajax = function(type, params) {
  var { path, body, success, error } = params;
  var xhr = new XMLHttpRequest();
  var url = baseURL + path;
  xhr.open(type, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    try {
      if (xhr.status > 299) throw new Error();
      success(typeof xhr.response==='string' ? xhr.response : JSON.parse(xhr.response));
    } catch (e) {
      error(xhr.status + ': ' + xhr.statusText);
    }
  };
  xhr.send(JSON.stringify(body));
}
var get = ajax.bind(this, 'get');
var post = ajax.bind(this, 'post');

get({
  path: '/',
  success: function(resp) {
    console.log(TAG+'resp: '+resp);
  },
  error: function(err) {
    console.log(TAG+'err: '+err);
  }
});

var createBookmark = function(bookmark, parentId) {
  bookmarks.getSubTree(parentId, function(trees) {
    if (!trees || !parentId) createBookmarksFolder(bookmark);
    var children = trees[0].children;
    var oldBookmark;
    for (var i = children.length; i--;)
      if (children[i].url===bookmark.url) return;
    bookmark.parentId = parentId;
    bookmarks.create(bookmark);
  });
};

onInstalled.addListener(function(details) {
  // if (details.reason!=='install') return;
  /*bookmarks.search({ title: 'Marq' }, function(results) {
    var folder = results[0];
    console.log(TAG+'folder: '+folder);
    if (folder) storeFolderId(folder);
    else createBookmarksFolder();
  });*/
  contextMenus.create({
    'title': 'Place a bookmark',
    'contexts': ['selection'],
    'id': 'marq-place'
  });
  contextMenus.create({
    'title': 'Copy link',
    'contexts': ['selection'],
    'id': 'marq-copy'
  });
});

var executeShowRule = function(tab) {
  tabs.executeScript(tab.id, {
    file: 'content/show-rule.js',
    runAt: 'document_start'
  });
};


var copyToClipboard = function(url) {

};

contextMenus.onClicked.addListener(function(info) {  
  tabs.query({
    active: true,
    currentWindow: true
  }, function(tabList) {
    var tab = tabList[0];
    if (!tab) return;
    executeShowRule(tab);
    tabs.executeScript(tab.id, {
      file: 'content/position.js'
    }, function(results) {
      var bookmark = results[0];
      post({
        path: '/',
        body: bookmark,
        success: function(resp) {
          console.log(TAG+'post succeeded');
          var url = resp.url;
          if (info.menuItemId==='marq-place')
            storage.local.get('folderId', function(result) {
              createBookmark(bookmark, result.folderId);
            });
          else if (info.menuItemId==='marq-copy')
            copyToClipboard(url);
        },
        error: function(err) {
          console.log(TAG+'err: '+err);
        }
      });
    });
  });
});

})(
  this,
  chrome.runtime.onInstalled,
  chrome.contextMenus,
  chrome.tabs,
  chrome.bookmarks,
  chrome.storage
);
