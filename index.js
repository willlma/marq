(async function () {
  'use strict';
  const { bookmarks, contextMenus, runtime, storage, tabs } = browser;
  const TAG = 'INDEX  ';

  const storeFolderId = async (folder) => {
    console.log(TAG + 'storing folderId: ' + folder.id);
    console.trace();
    await storage.local.set({ folderId: folder.id });
  };

  const createBookmark = async (bookmark, parentId) => {
    try {
      const trees = await bookmarks.getSubTree(parentId);
      if (!trees || !parentId) {
        return await createBookmarksFolder(bookmark);
      }
      const children = trees[0].children;
      for (let i = children.length; i--; ) {
        if (children[i].url === bookmark.url) return;
      }
      bookmark.parentId = parentId;
      await bookmarks.create(bookmark);
    } catch (e) {
      return await createBookmarksFolder(bookmark);
    }
  };

  const createBookmarksFolder = async (bookmark) => {
    const tree = await bookmarks.getTree();
    const children = tree[0].children;

    let bookmarksBarId;
    for (let i = children.length; i--; ) {
      if (children[i].title !== 'Bookmarks Toolbar') continue;
      bookmarksBarId = children[i].id;
      break;
    }

    const folder = await bookmarks.create({
      parentId: bookmarksBarId,
      title: 'Marq',
      index: 0,
    });
    await storeFolderId(folder);
    if (bookmark) await createBookmark(bookmark, folder.id);
    return folder;
  };

  runtime.onInstalled.addListener(async (details) => {
    const results = await bookmarks.search({ title: 'Marq' });
    const folder = results[0];
    console.log(TAG + 'folder: ' + folder);
    if (folder) {
      await storeFolderId(folder);
      console.log('if folder');
    } else {
      console.log('else');
      await createBookmarksFolder();
    }

    await contextMenus.create({
      title: 'Place a bookmark',
      contexts: ['selection'],
      id: 'marq-context-menu',
    });
  });

  const executeShowRule = async (tab) => {
    // show-rule.js is now loaded via content_scripts in manifest
    // No need to inject it dynamically anymore
  };

  contextMenus.onClicked.addListener(async () => {
    const tabList = await tabs.query({
      active: true,
      currentWindow: true,
    });
    const tab = tabList[0];
    if (!tab) return;

    await executeShowRule(tab);
    const results = await tabs.executeScript(tab.id, {
      file: 'content/position.js',
    });
    const bookmark = results[0];
    const result = await storage.local.get('folderId');
    await createBookmark(bookmark, result.folderId);
  });

  tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log(changeInfo.status);
    console.log(tab.url);
    if (changeInfo.status !== 'loading') return;

    const result = await storage.sync.get(tab.url);
    const position = result[tab.url];
    if (!position) return;

    await executeShowRule(tab);
    await tabs.executeScript(tabId, {
      file: 'content/restore.js',
      runAt: 'document_start',
    });
  });
})();
