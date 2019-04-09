TYPE_HIDE = 0
TYPE_RECOMMEND = 1
TYPE_NOTHING = 2

yogurt = ["B000VRC1NG", "B00FZHEGGW", "B008U5OSTQ", "B002M3ZBPW"]
bread = ["B001F79MMY", "B074H5B5XG", "B000LR4XJ6", "B004A94260"]
cereal = ["B005H12NJS", "B01763CJY8", "B0014CSH7G", "B000VK6558"]
healthy = yogurt.concat(bread).concat(cereal)

chrome.storage.local.get(['type'], function(result) {
    console.log("User type: " + result.type)
    switch(result.type) {
        case TYPE_HIDE:
            document.querySelectorAll("div[class^='asin_card__root__']").forEach(el => {
                if (-1 === healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])) {
                    el.parentElement.style.display = "none"
                }
            })
            break;
        case TYPE_RECOMMEND:
            document.querySelectorAll("div[class^='asin_card__root__']").forEach(el => {
                if (-1 !== healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])) {
                    el.style.backgroundColor = "green"
                }
            })
            break;
        case TYPE_NOTHING:
          // code block
      }
});