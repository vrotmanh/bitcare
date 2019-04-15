function healthyOptionsChangeTypeTo(newType){
    chrome.storage.local.get(['userId'], function(result) {
        var docRef = firebase.firestore().collection("users").doc(''+result.userId)
        docRef.get().then(function(querySnapshot){
          var doc = querySnapshot.data()
          doc.type = newType
          docRef.update(doc)
        })
    })
    chrome.storage.local.set({type: newType}, function() {})
    return "new type set to: " + newType
}