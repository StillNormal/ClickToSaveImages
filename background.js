var isRunning = false;

chrome.runtime.onInstalled.addListener(function (details) {
	//chrome.tabs.create({ url: 'options.html' }); // open options page after install
	
	var domain = /^(https?|(ht|f)tp?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
	chrome.tabs.query({}, function (tabs) { // inject js to pages that already open
		tabs.forEach(function(tab) {
			if (domain.test(tab.url)) {
				chrome.tabs.executeScript(tab.id, { file: "sendBackImageLink.js" });
			}
		});			
	});		
		
	chrome.browserAction.setBadgeText({text: ""});
});

chrome.browserAction.onClicked.addListener(function(temp) { // will not fired when add popup
	if (!isRunning) { 
		isRunning = true;
		chrome.browserAction.setBadgeText({text: "run"}); // use badge instead of popup
		chrome.browserAction.setBadgeBackgroundColor({color: [76, 183, 76, 255]}); // Green
		chrome.tabs.query({}, function (tabs) { // do not use getCurrent()
			tabs.forEach(function(tab) {
				chrome.tabs.sendMessage(tab.id, {
				content: "run",
				}, 	function(response) {});
			});			
		});		
	}
	else {
		isRunning = false;
		chrome.browserAction.setBadgeText({text: ""}); // when text is null, the badge will be removed away
		chrome.tabs.query({}, function (tabs) {
			tabs.forEach(function(tab) {
				chrome.tabs.sendMessage(tab.id, {
				content: "stop",
				}, 	function(response) {});
			});			
		});	
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) { // download API cannot be used in content-script
	//alert(message.content);
	if (message.content == "getStatus") {
		sendResponse(isRunning);
		return true; // must return true, or it will be synchronous
	}	
	
	chrome.downloads.download({ 
		url: message.content,
		conflictAction: "uniquify",
		saveAs: false 
	});
});