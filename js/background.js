todoDB.open(function() {});

chrome.extension.onRequest.addListener(
   function(request, sender, sendResponse) {
	console.log(sender);
	console.log(request);
        if (request.method == "find") {
	    console.log("find");
	    todoDB.findPost(request.web_id, function(event) {
	       sendResponse({event : event});
	    });
        }
        if (request.method == "save") {
	    todoDB.createPost(request.web_id, request.title, request.link, request.comment, request.thumbnail, function(event) {
	       sendResponse({ event : event});
	    });
        }
});
