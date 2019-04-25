// Import Firebase
var script = document.createElement("script");
script.setAttribute(
  "src",
  "https://www.gstatic.com/firebasejs/5.9.4/firebase.js"
);
document.head.appendChild(script);

const clearLocalStorage = () => {
  chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
};

const logExtensionState = () => {
  chrome.storage.local.get(["type", "healthyOptions", "userId"], result => {
    console.log(result);
  });
};

var userId = -1;
setTimeout(() => {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD2op7Z98xF7ikEVeWZT_9PnxaVxwyAUFQ",
    authDomain: "healthy-shopping-ebe01.firebaseapp.com",
    databaseURL: "https://healthy-shopping-ebe01.firebaseio.com",
    projectId: "healthy-shopping-ebe01",
    storageBucket: "healthy-shopping-ebe01.appspot.com",
    messagingSenderId: "57974608601"
  };
  firebase.initializeApp(config);
  var db = firebase.firestore();
  db.collection("products")
    .get()
    .then(function(querySnapshot) {
      healthyOptions = [];
      querySnapshot.forEach(function(doc) {
        healthyOptions.push(doc.data().id);
      });
      // Store the healthy options locally
      chrome.storage.local.set(
        { healthyOptions: healthyOptions },
        function() {}
      );
    });

  // Register user if new
  chrome.storage.local.get(["userId"], function(result) {
    // If new user
    userId = parseInt(result.userId);
    if (isNaN(result.userId)) {
      // Choose a random Type
      getUserType().then(type => {
        db.collection("users")
          .get()
          .then(function(querySnapshot) {
            var id = querySnapshot.docs.length + 1;
            userId = id;
            // Store it in Firebase
            var ref = db.collection("users").doc("" + id);
            ref.set({ id: id, type: type, clicks: [] });
            // Store it in Chrome
            chrome.storage.local.set({ userId: id }, function() {});
          });
      });
    }
  });
}, 100);

const getUserType = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["type"], result => {
      // There is no type stored
      const typeAsInt = parseInt(result.type);
      if (isNaN(typeAsInt)) {
        const type = Math.floor(Math.random() * 3);
        chrome.storage.local.set({ type: type }, () => {
          resolve(type);
        });
      } else {
        resolve(typeAsInt);
      }
    });
  });
};

// Handle product clicked message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "productClicked") {
    // Get healthy option
    chrome.storage.local.get(["healthyOptions"], function(result) {
      healthyOptions = result.healthyOptions;
      healthy = healthyOptions.includes(request.productId);
      productId = request.productId;
      // Store click in Firebase
      var docRef = firebase
        .firestore()
        .collection("users")
        .doc("" + userId);
      docRef.get().then(function(querySnapshot) {
        var doc = querySnapshot.data();
        doc.clicks.push({
          healthy: healthy,
          productId: productId,
          at: firebase.firestore.Timestamp.fromDate(new Date())
        });
        docRef.update(doc);
      });
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { status } = changeInfo;
  if (status === "complete") {
    chrome.tabs.sendMessage(tabId, { type: "refresh" });
  }
});

// Add script to change the type manually
var script2 = document.createElement("script");
script2.setAttribute("src", "changeTypeFunction.js");
document.head.appendChild(script2);
