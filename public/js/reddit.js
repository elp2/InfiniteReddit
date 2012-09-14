String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.beginsWith = function(prefix) {
    return this.indexOf(prefix) == 0;
};

var turl1 = "test/images/2.png", //"https://www.youtube.com/watch?v=r-rauuhbjto&amp;feature=plcp", //images/pic06.jpg", 
turl2 = "http://imgur.com/uS5Ka",  //"test/2.png", 
turl3 = "test/images/3.jpg", 
turl4 = "test/images/4.jpg"
turl5 = "http://imgur.com/a/kinkC"; //"test/5.jpg"
testingJsonData = {
    "kind": "Listing","data": {"modhash": "","children": [
            {"kind": "t3","data": {"domain": "imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "yzys5","clicked": false,"title": "Found a strawBEARy!","num_comments": 277,"score": 2141,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://f.thumbs.redditmedia.com/HNzAVvyLCx8ZidvG.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 6498,"saved": false,"is_self": false,"permalink": "/r/pics/comments/yzys5/found_a_strawbeary/","name": "t3_yzys5","created": 1346233214.0,"url": turl1,"author_flair_text": null,"author": "Taybow","created_utc": 1346208014.0,"media": null,"num_reports": null,"ups": 8639}}, 
            {"kind": "t3","data": {"domain": "i.imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "z0183","clicked": false,"title": "someone yelled \"hey catwoman!\" to me on the street today.","num_comments": 284,"score": 1521,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://a.thumbs.redditmedia.com/UjuoDj-6crcdBo70.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 1828,"saved": false,"is_self": false,"permalink": "/r/pics/comments/z0183/someone_yelled_hey_catwoman_to_me_on_the_street/","name": "t3_z0183","created": 1346235500.0,"url": turl2,"author_flair_text": null,"author": "hotmath","created_utc": 1346210300.0,"media": null,"num_reports": null,"ups": 3349}}, 
            {"kind": "t3","data": {"domain": "imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "yztwc","clicked": false,"title": "I'm 22 and I bought this house in December for $17,500","num_comments": 2952,"score": 2097,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://a.thumbs.redditmedia.com/ehZDlTgJtEYVxWL0.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 8099,"saved": false,"is_self": false,"permalink": "/r/pics/comments/yztwc/im_22_and_i_bought_this_house_in_december_for/","name": "t3_yztwc","created": 1346228666.0,"url": turl3,"author_flair_text": null,"author": "ohiock","created_utc": 1346203466.0,"media": null,"num_reports": null,"ups": 10196}}, 
            {"kind": "t3","data": {"domain": "imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "z01rw","clicked": false,"title": "Cat after being saved from a burning building.","num_comments": 87,"score": 1013,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://a.thumbs.redditmedia.com/q6HfTCDPJT6zG680.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 342,"saved": false,"is_self": false,"permalink": "/r/pics/comments/z01rw/cat_after_being_saved_from_a_burning_building/","name": "t3_z01rw","created": 1346235971.0,"url": turl4,"author_flair_text": null,"author": "k80k80k80","created_utc": 1346210771.0,"media": null,"num_reports": null,"ups": 1355}}, 
            {"kind": "t3","data": {"domain": "i.imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "yzkgy","clicked": false,"title": "Grew up on a reservation, quite poor. Told myself I would see the world. The first place I went.","num_comments": 372,"score": 1827,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://d.thumbs.redditmedia.com/KGR-lIf-fxSJevf9.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 4986,"saved": false,"is_self": false,"permalink": "/r/pics/comments/yzkgy/grew_up_on_a_reservation_quite_poor_told_myself_i/","name": "t3_yzkgy","created": 1346219594.0,"url": turl5,"author_flair_text": null,"author": "blindfishy","created_utc": 1346194394.0,"media": null,"num_reports": null,"ups": 6813}}
        
        ],"after": "t3_yyv33","before": null}};

REDDIT_THROTTLE_MS = 2000; // Max refresh rate as described in the Reddit APIs

!function(window) {
    'use strict';

    // Initial Setup
    // =============
    var reddit = window.reddit = {}

    // Packaging:
    function PicFetcher(options) {
        options = options || {};
        this.onlineMode = !!options.onlineMode;
        this.imgFn = options.imgFn; 
        this.htmlFn = options.htmlFn;
        
        this.canRequestAt = (new Date()).getTime();
        this.waitingForResponse = false;
        this.autoScrollToNext = true;
        
        if (this.onlineMode) {
            this.seenURLs = {};
        // TODO: Remove! TESTING getSeenURLs();
        } else {
            localStorage.clear();
            this.seenURLs = {};
        }
    }
    
    PicFetcher.prototype.setSubreddits = function(subreddits) {
        this.subreddits = subreddits;
        this.afterTag = "";
    }

    // Getting Posts
    
    PicFetcher.prototype.resetTimes = function() {
        this.canRequestAt = (new Date()).getTime() + REDDIT_THROTTLE_MS;
        this.waitingForResponse = false;
    }
    
    PicFetcher.prototype.getThrottleTime = function() {
        var now = (new Date()).getTime();
        var throttleTime = this.canRequestAt < now ? 0 : this.canRequestAt - now;
        return (throttleTime);
    }
    
    PicFetcher.prototype.getMorePosts = function(autoScrollToNext) {
        if (this.waitingForResponse) {
            return; // already have a live request so do nothing
        }
        this.waitingForResponse = true;
        if (autoScrollToNext) {
            this.autoScrollToNext = true;
        }
        
        var throttleTime = this.getThrottleTime();
        var self = this;
        setTimeout(function() {
            self._getMorePosts()
        }, throttleTime);
    }
    
    function urlForSubreddits(subreddits, after) {
        // http://www.reddit.com/r/starcraft/.json?jsonp=?&after=t3_yjbu1
        var redditsURLBase = "http://www.reddit.com/r/"
        var redditURLJsonEnding = "/.json?jsonp=?"
        
        var url = redditsURLBase
        url = url + subreddits.join("+")
        url = url + redditURLJsonEnding
        if (after.length > 0)
            url = url + "&after=" + after
        
        console.log("Getting URL=", url)
        
        return url;
    }
    
    PicFetcher.prototype._getMorePosts = function() {
        if (this.onlineMode) {
            var url = urlForSubreddits(this.subreddits, this.afterTag);
            var self = this;
            $.getJSON(url, function(data) {
                self.handlePosts(data);
            })
            .error(function() { alert("TODO: Handle Error getting JSON / end of reddit/etc show error page and keep retrying like on new image"); });
        } else {
            this.handlePosts(testingJsonData);
            this.afterTag = "";
        }
    }


    // ---- Getting Images
    function isImageFile(url) {
        var urlFile = url.split("?")[0].toLowerCase();
        var imageExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "apng"];
        for (var i = 0; i < imageExtensions.length; i++) {
            if (urlFile.endsWith(imageExtensions[i]))
                return (true);
        }
        ;
        return (false);
    }
    
    PicFetcher.prototype.shouldShowImage = function(item) {
        if (undefined == item || !item.url)
            return false;
        
        if (this.seenURLs[item.url]) {
            return false;
        }
        
        if (true == item.over_18) {
            return false;
        }
        
        if (!isImageFile(item.url)) {
            console.log(item.url, ": is not an image", item)
            return false;
        }
        return true;
    }
    
    function getSeenURLs() {
        var seenURLs = {};
        
        for (var url in localStorage) {
            var accessedAt = localStorage[url];
            if (!accessedAt.charAt(0) == "{")
                continue; // Had a random cb_cp key which I didn't set and isn't a valid JSON key
            try {
                seenURLs[url] = JSON.parse(accessedAt);
            } catch (e) {
                console.error("Error deserializing key=", url, "val=", accessedAt, ".\n", e);
            }
        }
        
        return (seenURLs);
    }
    
    PicFetcher.prototype.setSeenURL = function(url) {
        this.seenURLs[url] = true;
        var accessedAt = {"@": (new Date).getTime()};
        localStorage[url] = JSON.stringify(accessedAt);
    // TODO: handle cleanups of very old URLs since we have a max size of localstorage... maybe on fillup?
    }
    
    PicFetcher.prototype.appendImage = function(img) {
        if(!this.shouldShowImage(img))
            return;
        
        this.seenURLs[img.url] = true;
        var self = this;
       	// Insert preloaded image after it finishes loading via "load" callback
        $('<img />')
        .attr('src', img.url)
        .load(function() {
            var maxWidth = $(window).width() - 30;
            var scaledWidth = Math.min(maxWidth, this.width);
            var scaledHeight = this.height * (scaledWidth / this.width);

            // Shrink things if doing so slightly will make them fit completely on the page
            var acceptableShrink = 0.75;
            var maxHeight = $(window).height() - 30;
            if (maxHeight < scaledHeight && maxHeight / scaledHeight > acceptableShrink) {
                scaledWidth = scaledWidth * (maxHeight / scaledHeight);
                scaledHeight = maxHeight;
            }
            
            self.setSeenURL(img.url); // TODO: only call this when it's shown as our active image			
            self.imgFn(img, scaledWidth, scaledHeight, self.autoScrollToNext);
        });
    }

    PicFetcher.prototype.appendHtml = function(item, html) {
        if(this.seenURLs[item.url]) return;
    	this.seenURLs[item.url] = true;
        this.htmlFn(item, html);
    }
    
    PicFetcher.prototype.enrichItem = function(data) {
        var self = this;
        var matches = [{prefixes: ["imgur.com"],fn: function() {
                    self.getImgurLinks(data)
                }}, 
            {prefixes: ["qkme.me", "www.quickmeme.com", "quickmeme.com"],fn: function() {
                    self.getQuickMemeLink(data)
                }}, 
            {prefixes: ["youtube.com", "www.youtube.com", "youtu.be"], fn:function(){ self.getYoutubeLink(data)}},
        ];
        
        for (var i = matches.length - 1; i >= 0; i--) {
            var m = matches[i];
            for (var j = m.prefixes.length - 1; j >= 0; j--) {
                var prefix = m.prefixes[j];
                if (data.url.beginsWith("http://" + prefix ) || data.url.beginsWith("https://" + prefix)) {
                    m.fn();
                    return;
                }
            }
            ;
        }
        ;
        console.log("No enriching rule for: ", data.url, data);
    }
    
    PicFetcher.prototype.handlePosts = function(data) {
        this.afterTag = data.data && data.data.after;
        if (!this.afterTag) {
            console.error("TODO: No after tag.  You've reached the end of reddit!  Bad things will happen!");
        }
        
        var self = this;
        $.each(data.data.children, function(i, item) {
        	if (isImageFile(item.data.url)) {
                self.appendImage(item.data)
            } else {
                self.enrichItem(item.data);
            }
        });
        
        this.resetTimes();
    }
    
    // Debug
    PicFetcher.prototype.debug = function() {
    }
    
    PicFetcher.prototype.getImgurLinks = function(item) {
        var self = this;
        
        var split = item.url.split("/");
        var id = split[split.length - 1];
        
        if ("a" === split[split.length - 2]) { // Album
            $.getJSON(url, function(data) {
                var images = data.album && data.album.images;
                if (!images)
                    return;

            // TODO: actually add the album along with relevant titles/descriptions
            //console.log("Not able to support imgur albums yet", images.length, "images not being added");
            });
        } else { // normal image
            var url = "http://api.imgur.com/2/image/" + id + ".json";
            
            $.getJSON(url, function(data) {
                item.url = data.image && data.image.links && data.image.links.original;
                self.appendImage(item);
            });        
        }
    }
    PicFetcher.prototype.getQuickMemeLink = function(item) {
        var split = item.url.split("/");
        var hash = split[split.length - 1];
        if ("" === hash)
            hash = split[split.length - 2]; // handle trailing slash
        if (hash.indexOf("?") != -1)
            hash = hash.slice(0, hash.indexOf("?"));
        
        item.url = "http://i.qkme.me/" + hash + ".jpg";
        this.appendImage(item);
    }

    PicFetcher.prototype.getYoutubeLink = function(item) {
    	var videoIdRe = /.*v=([^&]*)/,
    		videoId = videoIdRe.exec(item.url)[1];

    	if(videoId) {
	    	var html = '<iframe class="youtube-player" type="text/html" width="640" height="385" '
	    	  + 'src="http://www.youtube.com/embed/' + videoId + '" frameborder="0"></iframe>';
	    	this.appendHtml(item, html);
    	} else {
    		console.error("Can't parse youtube video!!!", item.url);
    	}
    }

    // Export
    // ======

    // Classes:
    reddit.PicFetcher = PicFetcher;
}(window);