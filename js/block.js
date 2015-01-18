function getPosts() {
    var elements = $("#siteTable").children("div").filter(function() {
	    return $(this).data("fullname") != undefined && $(this).data("cid") == undefined; 
    });
    return elements;
}

function visited(web_id, callback) {
    //todoDB.findPost(web_id, callback);
    chrome.extension.sendRequest({method: "find", web_id: web_id}, function(response) {
	console.log(response);
        callback(response.event);
    });
}

function savePost(web_id, title, link, comment, thumbnail, callback) {
    chrome.extension.sendRequest({method: "save", 
		web_id: web_id,
		title: title,
		comment: comment,
		link: link,
		thumbnail: thumbnail }, 
       function(response) {
	   console.log("Success");
	   callback(response.event);
       });
}

$(document).ready(function() {
       // get all the posts on a page
       var posts = getPosts();
       
       // reindex posts
       var index = 1;
       var empty = true;
       if (posts.length > 0)
	   index = $(posts[0]).children(".rank").first().text();

       // set on click listener for when the user clicks on the link,
       // so we know they've already visited the page
       $(posts).each(function() {
	    var self = this;

	    var web_id = $(this).data("fullname");
	    var title = $(this).find("a.title").text();
	    var link = $(this).find("a.title").attr("href");
	    var thumbnail = $(this).find("a.thumbnail").children("img").first().attr("src");
	    if (link.indexOf("http") < 0) {
		link = "http://www.reddit.com" + link;
	    }
	    var comment = $(this).find("li.first").children("a").first().attr("href");

	    // first check if this page has been visited
	    visited(web_id, function(event) {
		var cursor = event.target.result;
	        if (cursor) {
		   $(self).hide(1000);
		   console.log(web_id);
		   //$(self).css("display", "none");
		   return;
		}

		$(self).children(".rank").first().text(index);
		empty = false;
		index++;

		var save = function() {
		    savePost(web_id, title, link, comment, thumbnail, function(event) {});
		};

		$(self).find(".title").first().click(save);

		$(self).find(".expando-button").first().click(save);

		$(self).find(".thumbnail").first().click(save);

		if (comment.indexOf(link) > -1) {
		    $(self).find(".first").children("a").click(save);
		}
	    });
	});

	if (empty) {
	    // Draw some overlay or something
	}
});

