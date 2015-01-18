$(document).ready(function() {
   todoDB.open(getWords);

});

function getWords() {
    todoDB.fetchPosts(function(posts) {
       for(var i = 0; i < posts.length; i++) {
	   console.log(posts[i]);
	   var row = "<li class='item' id='" + posts[i]['web_id'] + "' ><div>";

	   if (posts[i]['thumbnail']) 
	       row = row + "<a href='" + posts[i]['link'] + "'><img src='http://"+ posts[i]['thumbnail'] + "' width=70 height=70></img></a>";

	   row = row + "<div class='title'><a href='" + posts[i]['link'] + "'>" + posts[i]['title'] + "</a></div>"; 
	   row = row + "<div class='comment'><a href='" + posts[i]['comment'] + "'>comment</a></div>";
	   row = row + "<div class='delete'><a href='#''>x</a></div></div></li>";

	   $("#postlist").append(row);
       }
       setRemove();
    });
}

function setRemove() {
    $(".delete").click(function() {
	var parent = $(this).parents(".item").first();
	var web_id = $(parent).attr("id");
	todoDB.findPost(web_id, function(event) {
	       todoDB.deletePost(event.target.result['timestamp'], function(event) {;
	           console.log(event);
		   $(parent).remove();
	       });
	});
    });
}