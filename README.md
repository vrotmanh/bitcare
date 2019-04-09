![Healthy Shopping logo](logo.png)
# Healthy Shopping
Healthy food shopping recommendation chrome extension


For Liran:
```javascript
healthy = ["B008U5OSTQ", "B000QJGLHG"]

document.querySelectorAll("div[class^='asin_card__root__']").forEach(el => {
	if (-1 !== healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])) {
		el.style.backgroundColor = "green"
    }
})
```

