const productId = window.location.href.split("/")[4].split("?")[0]

// Send message to background
chrome.runtime.sendMessage({type: 'productClicked', productId: productId});