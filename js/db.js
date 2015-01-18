var todoDB = (function() {
   var tDB = {};
   var datastore = null;

   // TODO: Add methods for interacting with the database here.
   /**
    * Open a connection to the datastore.
    */
   tDB.open = function(callback) {
       // Database version.
       var version = 1;

       // Open a connection to the datastore.
       var request = indexedDB.open('block', version);

       // Handle datastore upgrades.
       request.onupgradeneeded = function(e) {
	   var db = e.target.result;
	   console.log("upgraded");
	   e.target.transaction.onerror = tDB.onerror;

	   // Delete the old datastore.
	   if (db.objectStoreNames.contains('posts')) {
	       db.deleteObjectStore('posts');
	   }

	   // Create a new datastore.
	   var store = db.createObjectStore('posts', {
		   keyPath: 'timestamp'
	       });
	   store.createIndex('web_id', 'web_id', { unique: true });
       };

       // Handle successful datastore access.
       request.onsuccess = function(e) {
	   // Get a reference to the DB.
	   datastore = e.target.result;

	   // Execute the callback.
	   callback();
       };

       // Handle errors when opening the datastore.
       request.onerror = tDB.onerror;
   };   

   /**
    * Fetch all of the todo items in the datastore.
    */
   tDB.fetchPosts = function(callback) {
       var db = datastore;
       var transaction = db.transaction(['posts'], IDBTransaction.READ_ONLY);
       var objStore = transaction.objectStore('posts');

       var keyRange = IDBKeyRange.lowerBound(0);
       var cursorRequest = objStore.openCursor();

       var posts = [];

       transaction.oncomplete = function(e) {
	   // Execute the callback function.
	   callback(posts);
       };

       cursorRequest.onsuccess = function(e) {
	   var result = e.target.result;

	   if (!result) {
	       return;
	   }
	   posts.push(result.value);

	   result.continue();
       };

       cursorRequest.onerror = tDB.onerror;
   };

   /**
    * Create a new todo item.
    */
   tDB.createPost = function(web_id, title, link, comment, thumbnail, callback) {
       // Get a reference to the db.
       var db = datastore;

       // Initiate a new transaction.
       var transaction = db.transaction(['posts'], 'readwrite');

       // Get the datastore.
       var objStore = transaction.objectStore('posts');

       // Create a timestamp for the todo item.
       var timestamp = new Date().getTime();

       // Create an object for the todo item.
       var post = {
	   'web_id': web_id,
	   'title' : title,
	   'link' : link,
	   'comment' : comment,
	   'thumbnail' : thumbnail,
	   'timestamp': timestamp
       };

       // Create the datastore request.
       var request = objStore.put(post);

       // Handle a successful datastore put.
       request.onsuccess = function(e) {
	   // Execute the callback function.
	   callback(post);
       };

       // Handle errors.
       request.onerror = tDB.onerror;
   };

   /**
    * Delete a todo item.
    */
   tDB.deletePost = function(id, callback) {
       var db = datastore;
       var transaction = db.transaction(['posts'], 'readwrite');
       var objStore = transaction.objectStore('posts');

       var request = objStore.delete(id);

       request.onsuccess = function(e) {
	   callback(e);
       }

       request.onerror = function(e) {
	   console.log(e);
       }
   };

   tDB.findPost = function(web_id, callback) {
       var db = datastore;
       var transaction = db.transaction(['posts'], 'readwrite');
       var objStore = transaction.objectStore('posts');
       var index = objStore.index('web_id');
       request = index.get(web_id);

       request.onsuccess = function(event) {
           callback(event);
       };

       request.onerror = function(e) {
	   console.log(e);
       }
   }

   // Export the tDB object.
   return tDB;
}());