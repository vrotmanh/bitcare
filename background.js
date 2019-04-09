chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(['type'], function(result) {
    if(!result.type){
      const type = Math.floor(Math.random() * 3);
      chrome.storage.local.set({type: type}, function() {});
    }
  });
});