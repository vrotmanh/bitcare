TYPE_HIDE = 0;
TYPE_RECOMMEND = 1;
TYPE_NOTHING = 2;

const getUserType = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['type'], (result) => {
      // There is no type stored
      const typeAsInt = parseInt(result.type);
      if (isNaN(typeAsInt)) {
        const type = Math.floor(Math.random() * 3);
        chrome.storage.local.set({type: type}, () => {
          resolve(type);
        });
      } else {
        resolve(typeAsInt);
      }
    })
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "refresh":
      scheduleUpdate();
      break;
    default:
      console.error("chrome.runtime.onMessage: No request type on message");
  }
});

// Get healthy option
chrome.storage.local.get(["healthyOptions"], function(result) {
  healthy = result.healthyOptions;
});

const scheduleUpdate = () => {
  setTimeout(() => {
    const productsCheckInterval = setInterval(() => {
      const productsCount = document.querySelectorAll("div[class^='asin_card__root__']").length;
  
      if (productsCount > 0) {
        clearInterval(productsCheckInterval)
        update()
      }
    }, 50)
  }, 1000);
};

const update = () => {

  getUserType().then((type) => {
    console.log(`Got user type ${type} - refreshing`);
    switch (type) {
      case TYPE_HIDE:
        document
          .querySelectorAll("div[class^='asin_card__root__']")
          .forEach(el => {
            if (
              -1 ===
              healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])
            ) {
              el.parentElement.style.display = "none";
            }
          });
        break;
      case TYPE_RECOMMEND:
        document
          .querySelectorAll("div[class^='asin_card__root__']")
          .forEach(el => {
            if (
              -1 !==
              healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])
            ) {
              const img = document.createElement("img");
              img.src = chrome.extension.getURL("/assets/healthy-seal.png");
              img.style.cssText =
                "position: absolute; left: 0; top: 0; margin: 0.5rem; width: 5rem; height: auto;";
              el.append(img);
            }
          });
        break;
      case TYPE_NOTHING:
      // nothing
    }
  });
}

scheduleUpdate();
