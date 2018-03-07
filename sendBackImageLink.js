var isRunning;

chrome.runtime.sendMessage({ // init
	content: "getStatus",
}, 	function(response) {
		isRunning = response;
		if (isRunning){
			document.oncontextmenu = function() {
				return false;
			}
		}
		else {
			document.oncontextmenu = function() {}	
		}	
	}
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.content == "run") {
		isRunning = true;
		document.oncontextmenu = function() {
			return false;
		}
	}
	else if (message.content == "stop") {
		isRunning = false;
		document.oncontextmenu = function() {
		}
	}
});

window.onmouseup = function(e) {
	if (!isRunning) 
		return;
	
	if (e.button == 0 || e.button == 1) // only right-click can have effects
		return;
			
	var e = window.event.target;
	if (e.tagName == "img" || e.tagName == "IMG") {
		chrome.runtime.sendMessage({
			content: e.src,
		}, 	function(response) {});
	}
}