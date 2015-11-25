(function(exports, onInstalled, contextMenus, tabs, bookmarks, storage) {
'use strict';
var TAG = 'INDEX  ';

var storeFolderId = function(folder) {
  console.log(TAG+'storing folderId: ' + folder.id);
  console.trace();
  storage.local.set({ folderId: folder.id});
};

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

var createBookmarksFolder = function(bookmark) {
  bookmarks.getChildren('0', function(children) {
    for (var i = children.length; i--;) {
      if (children[i].title!=='Bookmarks Bar') continue;
      var bookmarksBarId = children[i].id;
      break;
    }
    bookmarks.create({
      parentId: bookmarksBarId,
      title: 'Marq',
      index: 0
    }, function(folder) {
      storeFolderId(folder);
      if (bookmark) createBookmark(bookmark, folder.id);
    });
  });
};

onInstalled.addListener(function(details) {
  // if (details.reason!=='install') return;
  bookmarks.search({ title: 'Marq' }, function(results) {
    var folder = results[0];
    console.log(TAG+'folder: '+folder);
    if (folder) storeFolderId(folder);
    else createBookmarksFolder();
  });
  contextMenus.create({
    'title': 'Place a bookmark',
    'contexts': ['selection'],
    'id': 'marq-context-menu'
  });
});

var executeShowRule = function(tab) {
  tabs.executeScript(tab.id, {
    file: 'content/show-rule.js',
    runAt: 'document_start'
  });
};

contextMenus.onClicked.addListener(function() {  
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
      storage.local.get('folderId', function(result) {
        createBookmark(bookmark, result.folderId);
      });
    });
  });
});

tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log(changeInfo.status);
  console.log(tab.url);
  if (changeInfo.status!=='loading') return;
  storage.sync.get(tab.url, function(result) {
    var position = result[tab.url];
    if (!position) return;
    executeShowRule(tab);
    tabs.executeScript(tabId, {
      file: 'content/restore.js',
      runAt: 'document_start'
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
