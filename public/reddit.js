String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

testingJsonData = {
"kind": "Listing", "data": {"modhash": "", "children": [
{"kind": "t3", "data": {"domain": "imgur.com", "banned_by": null, "media_embed": {}, "subreddit": "pics", "selftext_html": null, "selftext": "", "likes": null, "link_flair_text": null, "id": "yzys5", "clicked": false, "title": "Found a strawBEARy!", "num_comments": 277, "score": 2141, "approved_by": null, "over_18": false, "hidden": false, "thumbnail": "http://f.thumbs.redditmedia.com/HNzAVvyLCx8ZidvG.jpg", "subreddit_id": "t5_2qh0u", "edited": false, "link_flair_css_class": null, "author_flair_css_class": null, "downs": 6498, "saved": false, "is_self": false, "permalink": "/r/pics/comments/yzys5/found_a_strawbeary/", "name": "t3_yzys5", "created": 1346233214.0, "url": "test/1.jpeg", "author_flair_text": null, "author": "Taybow", "created_utc": 1346208014.0, "media": null, "num_reports": null, "ups": 8639}},
{"kind": "t3", "data": {"domain": "i.imgur.com", "banned_by": null, "media_embed": {}, "subreddit": "pics", "selftext_html": null, "selftext": "", "likes": null, "link_flair_text": null, "id": "z0183", "clicked": false, "title": "someone yelled \"hey catwoman!\" to me on the street today.", "num_comments": 284, "score": 1521, "approved_by": null, "over_18": false, "hidden": false, "thumbnail": "http://a.thumbs.redditmedia.com/UjuoDj-6crcdBo70.jpg", "subreddit_id": "t5_2qh0u", "edited": false, "link_flair_css_class": null, "author_flair_css_class": null, "downs": 1828, "saved": false, "is_self": false, "permalink": "/r/pics/comments/z0183/someone_yelled_hey_catwoman_to_me_on_the_street/", "name": "t3_z0183", "created": 1346235500.0, "url": "test/2.png", "author_flair_text": null, "author": "hotmath", "created_utc": 1346210300.0, "media": null, "num_reports": null, "ups": 3349}},
{"kind": "t3", "data": {"domain": "imgur.com", "banned_by": null, "media_embed": {}, "subreddit": "pics", "selftext_html": null, "selftext": "", "likes": null, "link_flair_text": null, "id": "yztwc", "clicked": false, "title": "I'm 22 and I bought this house in December for $17,500", "num_comments": 2952, "score": 2097, "approved_by": null, "over_18": false, "hidden": false, "thumbnail": "http://a.thumbs.redditmedia.com/ehZDlTgJtEYVxWL0.jpg", "subreddit_id": "t5_2qh0u", "edited": false, "link_flair_css_class": null, "author_flair_css_class": null, "downs": 8099, "saved": false, "is_self": false, "permalink": "/r/pics/comments/yztwc/im_22_and_i_bought_this_house_in_december_for/", "name": "t3_yztwc", "created": 1346228666.0, "url": "test/3.jpg", "author_flair_text": null, "author": "ohiock", "created_utc": 1346203466.0, "media": null, "num_reports": null, "ups": 10196}}, 
{"kind": "t3", "data": {"domain": "imgur.com", "banned_by": null, "media_embed": {}, "subreddit": "pics", "selftext_html": null, "selftext": "", "likes": null, "link_flair_text": null, "id": "z01rw", "clicked": false, "title": "Cat after being saved from a burning building.", "num_comments": 87, "score": 1013, "approved_by": null, "over_18": false, "hidden": false, "thumbnail": "http://a.thumbs.redditmedia.com/q6HfTCDPJT6zG680.jpg", "subreddit_id": "t5_2qh0u", "edited": false, "link_flair_css_class": null, "author_flair_css_class": null, "downs": 342, "saved": false, "is_self": false, "permalink": "/r/pics/comments/z01rw/cat_after_being_saved_from_a_burning_building/", "name": "t3_z01rw", "created": 1346235971.0, "url": "test/4.jpg", "author_flair_text": null, "author": "k80k80k80", "created_utc": 1346210771.0, "media": null, "num_reports": null, "ups": 1355}}, 
{"kind": "t3", "data": {"domain": "i.imgur.com", "banned_by": null, "media_embed": {}, "subreddit": "pics", "selftext_html": null, "selftext": "", "likes": null, "link_flair_text": null, "id": "yzkgy", "clicked": false, "title": "Grew up on a reservation, quite poor. Told myself I would see the world. The first place I went.", "num_comments": 372, "score": 1827, "approved_by": null, "over_18": false, "hidden": false, "thumbnail": "http://d.thumbs.redditmedia.com/KGR-lIf-fxSJevf9.jpg", "subreddit_id": "t5_2qh0u", "edited": false, "link_flair_css_class": null, "author_flair_css_class": null, "downs": 4986, "saved": false, "is_self": false, "permalink": "/r/pics/comments/yzkgy/grew_up_on_a_reservation_quite_poor_told_myself_i/", "name": "t3_yzkgy", "created": 1346219594.0, "url": "test/5.jpg", "author_flair_text": null, "author": "blindfishy", "created_utc": 1346194394.0, "media": null, "num_reports": null, "ups": 6813}}

  ], "after": "t3_yyv33", "before": null}}

!function(window) {
	'use strict';


	// Initial Setup
	// =============
	var reddit = window.reddit = {}

	// Packaging:
	function PicFetcher(listView, options) {
		options = options || {};
		this.onlineMode = !!options.onlineMode;
		this.listView = listView;
		this.waitingForResponse = false;
		this.lastRequestedTime = 0;
		this.seenURLs = {};
	}

	PicFetcher.prototype.setSubreddits = function(subreddits) {
		this.subreddits = subreddits;
		this.afterTag = "";
	}

	// Getting Posts

	PicFetcher.prototype.resetTimes = function() {
		this.lastRequestedTime = 0; // TODO: time
		this.waitingForResponse = false;
	}

	PicFetcher.prototype.getThrottleTime = function() {
		this.lastRequestedTime = 0; // TODO: get current time
		// TODO: do this for real with currentTime() equivalent
		return 5;
	}

	PicFetcher.prototype.getMorePosts = function () {
		if(this.waitingForResponse) return; // already have a live request so do nothing

		this.waitingForResponse = true;

		var throttleTime = this.getThrottleTime();
		this._getMorePosts();
		//setTimeout( self._getMorePosts, throttleTime ); // TODO: callback of private function with scope from setTimeout
	}

	function urlForSubreddits(subreddits, after ) {
		// http://www.reddit.com/r/starcraft/.json?jsonp=?&after=t3_yjbu1
		var redditsURLBase = "http://www.reddit.com/r/"
		var redditURLJsonEnding = "/.json?jsonp=?"

		var url = redditsURLBase
		url = url + subreddits.join("+") 
		url = url + redditURLJsonEnding
		if( after.length > 0 )
			url = url + "&after=" + after

		console.log("Getting URL=", url)	

		return url;	
	}


	PicFetcher.prototype._getMorePosts = function() {

		if( this.onlineMode ) {
			var url = urlForSubreddits( this.subreddits, this.afterTag);
			var self = this;
			$.getJSON(url, function(data) { 
				this.afterTag = data.data.after;
				// TODO: possible for after to become empty after a while ... "after": null, "before": null
				self.handlePosts(data);
			});
		} else {
			this.handlePosts(testingJsonData);
			this.afterTag = "";
		}
	}


	// ---- Getting Images
	function isImageExtension(url) {
		var urlFile = url.split("?")[0].toLowerCase();
		var imageExtensions = [ "png", "jpeg", "jpg", "gif" ];
		for (var i = 0; i < imageExtensions.length; i++) {
			if(urlFile.endsWith(imageExtensions[i]))
				return(true);
		};
		return(false);	
	}

	PicFetcher.prototype.shouldShowImage = function(item) {
		if(undefined == item)
			return false;

		if(this.seenURLs[item.url]) {
			console.log(item.url, ": already seen");
			return false;
		}

		if(true == item.over_18) {
			console.log(item.url, ": is over 18");
			return false;
		}

		if(!isImageExtension(item.url)) {
			console.log(item.url, ": is not an image")
			return false;
		}
		console.log("Showing: ", item.url);
		return true;
	}

	PicFetcher.prototype.setSeenURL = function(url) {
		this.seenURLs[url] = true;
		// TODO: write to local storage
	}

	PicFetcher.prototype.appendImage = function(img) {
		if(!this.shouldShowImage(img))
			return;

		this.seenURLs[img.url] = true;
		var listView = this.listView;
    	// Insert preloaded image after it finishes loading
		$('<img />')
	    .attr('src', img.url)
	    .load(function(){
			var scaledWidth = this.width;
			var maxWidth = $(window).width() - 30
			img.scaledWidth = Math.min(maxWidth, this.width);
			img.scaledHeight = this.height * ( img.scaledWidth / this.width );

			var imageDiv = imageTemplate(img);
			listView.append($(imageDiv));
	    });
	}

	PicFetcher.prototype.handlePosts = function(data) {
		this.afterTag = data.data && data.data.after;
		if( !this.afterTag ) {
			console.error("TODO: No after tag.  You've reached the end of reddit!  Bad things will happen!");
		}

		var self = this;
		$.each(data.data.children, function(i,item){
			self.appendImage(item.data)
    	});

		this.resetTimes();
	}

	PicFetcher.prototype.advance = function(delta) {
		var couldAdvance = this.listView.advance(delta);
		if(!couldAdvance) {
			//TODO: show getting more iterstatial, make the next one auto scrolled to
			this.getMorePosts();
		}
	}
	// Debug
	PicFetcher.prototype.debug = function() {
		this.listView.debug();
	}

	// Export
	// ======

	// Classes:
	reddit.PicFetcher = PicFetcher;
}(window);