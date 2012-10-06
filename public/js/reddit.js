/*jshint browser:true, jquery:true, devel:true */
/*global localStorage: false, _:false, REDDIT_THROTTLE_MS:false, TESTING_LOAD_DELAY_MS:false, testingJsonData: false,
ASSUME_404_AFTER_MS:false, IMAGES_BUFFER_LENGTH:false */

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};


String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.beginsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

var turl1 = "test/images/pic06.jpg", //https://www.youtube.com/watch?v=r-rauuhbjto&amp;feature=plcp", 
turl2 = "test/images/2.png", 
turl3 = "test/images/3.jpg", 
turl4 = "test/images/4.jpg",
turl5 = "test/images/5.jpg";
testingJsonData = {
    "kind": "Listing","data": {"modhash": "","children": [
            {"kind": "t3","data": {"domain": "imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "yzys5","clicked": false,"title": "Found a strawBEARy!","num_comments": 277,"score": 2141,"approved_by": null,"over_18": true,"hidden": false,"thumbnail": "http://f.thumbs.redditmedia.com/HNzAVvyLCx8ZidvG.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 6498,"saved": false,"is_self": false,"permalink": "/r/pics/comments/yzys5/found_a_strawbeary/","name": "t3_yzys5","created": 1346233214.0,"url": turl1,"author_flair_text": null,"author": "Taybow","created_utc": 1346208014.0,"media": null,"num_reports": null,"ups": 8639}}, 
            {"kind": "t3","data": {"domain": "i.imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "z0183","clicked": false,"title": "Someone yelled \"hey catwoman!\" to me on the street today.","num_comments": 284,"score": 1521,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://a.thumbs.redditmedia.com/UjuoDj-6crcdBo70.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 1828,"saved": false,"is_self": false,"permalink": "/r/pics/comments/z0183/someone_yelled_hey_catwoman_to_me_on_the_street/","name": "t3_z0183","created": 1346235500.0,"url": turl2,"author_flair_text": null,"author": "hotmath","created_utc": 1346210300.0,"media": null,"num_reports": null,"ups": 3349}}, 
            {"kind": "t3","data": {"domain": "imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "yztwc","clicked": false,"title": "I'm 22 and I bought this house in December for $17,500","num_comments": 2952,"score": 2097,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://a.thumbs.redditmedia.com/ehZDlTgJtEYVxWL0.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 8099,"saved": false,"is_self": false,"permalink": "/r/pics/comments/yztwc/im_22_and_i_bought_this_house_in_december_for/","name": "t3_yztwc","created": 1346228666.0,"url": turl3,"author_flair_text": null,"author": "ohiock","created_utc": 1346203466.0,"media": null,"num_reports": null,"ups": 10196}}, 
            {"kind": "t3","data": {"domain": "imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "z01rw","clicked": false,"title": "Cat after being saved from a burning building.","num_comments": 87,"score": 1013,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://a.thumbs.redditmedia.com/q6HfTCDPJT6zG680.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 342,"saved": false,"is_self": false,"permalink": "/r/pics/comments/z01rw/cat_after_being_saved_from_a_burning_building/","name": "t3_z01rw","created": 1346235971.0,"url": turl4,"author_flair_text": null,"author": "k80k80k80","created_utc": 1346210771.0,"media": null,"num_reports": null,"ups": 1355}}, 
            {"kind": "t3","data": {"domain": "i.imgur.com","banned_by": null,"media_embed": {},"subreddit": "pics","selftext_html": null,"selftext": "","likes": null,"link_flair_text": null,"id": "yzkgy","clicked": false,"title": "Grew up on a reservation Grew up on a reservation Grew up on a reservation Grew up on a reservation, quite poor. Told myself I would see the world. The first place I went.","num_comments": 372,"score": 1827,"approved_by": null,"over_18": false,"hidden": false,"thumbnail": "http://d.thumbs.redditmedia.com/KGR-lIf-fxSJevf9.jpg","subreddit_id": "t5_2qh0u","edited": false,"link_flair_css_class": null,"author_flair_css_class": null,"downs": 4986,"saved": false,"is_self": false,"permalink": "/r/pics/comments/yzkgy/grew_up_on_a_reservation_quite_poor_told_myself_i/","name": "t3_yzkgy","created": 1346219594.0,"url": turl5,"author_flair_text": null,"author": "blindfishy","created_utc": 1346194394.0,"media": null,"num_reports": null,"ups": 6813}}
        
        ],"after": "t3_yyv33","before": null}};

REDDIT_THROTTLE_MS = 2000; // Max refresh rate as described in the Reddit APIs
TESTING_LOAD_DELAY_MS = 2;
IMAGES_BUFFER_LENGTH = 10;
ASSUME_404_AFTER_MS = 4000;

!function(window) {
    'use strict';

    // Initial Setup
    // =============
    var reddit = window.reddit = {};

    // Packaging:
    function PicFetcher(options) {
        options = options || {};
        this.onlineMode = !!options.onlineMode;
        this.imgFn = options.imgFn; 
        this.htmlFn = options.htmlFn;
        this.statusFn = options.statusFn;
        this.show_over_18 = !!options.show_over_18;
        this.show_videos = !!options.show_videos;
        
        this.canRequestAt = (new Date()).getTime();
        this.waitingForResponse = false;
        this.items = [];
        this.itemsIndex = 0;
        this.hnct = "";
        
        if (this.onlineMode) {
            this.seenPermalinks = getSeenPermalinks();
        } else {
            this.seenPermalinks = {};
        }
    }
    
    PicFetcher.prototype.setShow_over_18 = function(bool) {
        this.show_over_18 = bool;
    };

    PicFetcher.prototype.setShow_Videos = function(bool) {
        this.show_videos = bool;
    };

    PicFetcher.prototype.setSubreddits = function(subreddits, hnct) {
        this.subreddits = subreddits;
        this.hnct = hnct;
        this.afterTag = "";
        this.items = [];
        this.itemsIndex = 0;   
        this.nsfwDiscarded = this.consecutiveDiscarded = this.fetchingErrors = this.endOfReddit = 0;
        this.waitingForResponse = false;

        this.getMorePosts();     
    };

    // Getting Posts
    
    PicFetcher.prototype.resetTimes = function() {
        this.canRequestAt = (new Date()).getTime() + REDDIT_THROTTLE_MS;
        this.waitingForResponse = false;
    };
    
    PicFetcher.prototype.getThrottleTime = function() {
        var now = (new Date()).getTime();
        var throttleTime = this.canRequestAt < now ? 0 : this.canRequestAt - now;
        return (throttleTime);
    };

    PicFetcher.prototype.shouldFetchMorePosts = function() {
        return(this.itemsIndex > this.items.length - IMAGES_BUFFER_LENGTH);
    };

    PicFetcher.prototype.advance = function() {
        if(this.itemsIndex<=this.items.length-1) this.itemsIndex++;
        if(this.shouldFetchMorePosts()) {
            reddit.log("getting more!", this.itemsIndex, "/", this.items.length);
            this.getMorePosts();
        }
    };

    PicFetcher.prototype.retreat = function() {
        if(this.itemsIndex>0) this.itemsIndex--;
    };
    
    PicFetcher.prototype.getMorePosts = function() {
        this.updateStatus();

        if(!this.subreddits || !this.subreddits.length) {
            return;
        }
        if (this.waitingForResponse) {
            return; // already have a live request so do nothing
        }
        this.waitingForResponse = true;
        
        var throttleTime = this.getThrottleTime();
        var self = this;
        setTimeout(function() {
            self._getMorePosts();
        }, throttleTime);
    };
    
    PicFetcher.prototype._getUrlForSubreddits = function(subreddits, after, hnct) {
        var redditURLTemplate = "http://www.reddit.com/r/{{subredditsString}}/{{hnctString}}/.json?jsonp=?{{afterString}}";

        var url = _.template(redditURLTemplate, { subredditsString: subreddits.join("+"),
                                                  hnctString: hnct,
                                                  afterString: after.length>0 ? "&after=" + after : "" });

        reddit.log("Getting URL=", url);        
        return url;
    };
    
    var cumDelay=0;
    function testLoads(self, child) {
        cumDelay += TESTING_LOAD_DELAY_MS;
        var here = {data:{after:testingJsonData.data.after, children:[child]}};
        setTimeout(function() {self.handlePosts(here);}, cumDelay);
    }

    PicFetcher.prototype.fetchingError = function() {
        reddit.error("Error fetching from Reddit");
        this.fetchingErrors++; 
        this.updateStatus(); 
        this.resetTimes();
        var self = this;
        setTimeout(function(){self.getMorePosts();}, 1.5*REDDIT_THROTTLE_MS);
    };

    PicFetcher.prototype._getMorePosts = function() {
        var self = this;

        if (this.onlineMode) {
            var url = this._getUrlForSubreddits(this.subreddits, this.afterTag, this.hnct);
            var success = false;            
            $.getJSON(url, function(data) {
                success = true;
                self.handlePosts(data);
            })
            .error(function() { 
                self.fetchingError();
            });
            // Check for 404's by using a timeout since we don't get any JSON callbacks since there's no JSON to inject into the page
            setTimeout(function() { if(!success) { self.fetchingError(); } }, ASSUME_404_AFTER_MS);
        } else {
            this.afterTag = "";
            for (var i = testingJsonData.data.children.length - 1; i >= 0; i--) {
                var child = testingJsonData.data.children[i];
                testLoads(self, child);
            }
        }

        // Attempt to get more in a bit in case we haven't loaded enough
        setTimeout(function() {
            if(self.shouldFetchMorePosts()) {
                self.getMorePosts();
            }
        }, REDDIT_THROTTLE_MS*2);
    };

    // ---- Getting Images
    function isImageFile(url) {
        var urlFile = url.split("?")[0].toLowerCase();
        var imageExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "apng"];
        for (var i = 0; i < imageExtensions.length; i++) {
            if (urlFile.endsWith(imageExtensions[i]))
                return (true);
        }
        
        return (false);
    }
    
    PicFetcher.prototype.shouldShowImage = function(item) {
        if (undefined === item || !item.url)
            return false;
        
        if (!isImageFile(item.url)) {
            reddit.log(item.url, ": is not an image", item);
            return false;
        }
        return true;
    };
    
    // We only want to persist that we saw the item when the user sees the item.
    PicFetcher.prototype.userSawItem = function(item) {
        var permalink = item.permalink;
        localStorage[permalink] = (new Date()).getTime();
    };

    // Need to keep internal track of what item's the fetcher saw so it doesn't add them twice
    PicFetcher.prototype.fetcherSawItem = function(item) {
        var permalink = item.permalink;
        this.seenPermalinks[permalink] = true;
    };

    PicFetcher.prototype.haveSeenItem = function(item) {
        if(undefined===item.permalink) throw("No permalink on item!");
        return(undefined!==this.seenPermalinks[item.permalink]);
    };

    function getSeenPermalinks() {
        var permalinks = {};
        
        for (var permalink in localStorage) {
            permalinks[permalink] = localStorage[permalink];
        }
        
        return (permalinks);
    }
        
    PicFetcher.prototype.appendImage = function(item) {
        if(!this.shouldShowImage(item)) {
            this.consecutiveDiscarded++;
            return;
        }
        this.consecutiveDiscarded = 0;
        var self = this;
        // Insert preloaded image after it finishes loading via "load" callback
        $('<img />')
        .attr('src', item.url)
        .load(function() {
            var img = $(this);   
            img.height(this.height);
            img.width(this.width);

            self.imgFn(item, img);
            self.items.push(item);
        })
        .error(function(){
            reddit.error("Error loading " + item.url);
        });
    };

    PicFetcher.prototype.appendHtml = function(item, html) {
        this.items.push(item);
        this.htmlFn(item, html);
    };
    
    PicFetcher.prototype.enrichItem = function(data) {
        var self = this;
        var matches = [{prefixes: ["imgur.com"],fn: function() {
                    self.getImgurLinks(data);
                }}, 
            {prefixes: ["qkme.me", "www.quickmeme.com", "quickmeme.com"],fn: function() {
                    self.getQuickMemeLink(data);
                }}, 
            {prefixes: ["youtube.com", "www.youtube.com", "youtu.be"], fn:function(){ 
                self.getYoutubeLink(data);
                }}
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
        }
        // reddit.log("No enriching rule for: ", data.url, data);
    };
    
    PicFetcher.prototype.updateStatus = function() {
        this.statusFn(this.consecutiveDiscarded, this.nsfwDiscarded, this.fetchingErrors, this.endOfReddit);        
    };

    PicFetcher.prototype.handleListing = function(item) {
        if(this.haveSeenItem(item)) 
            return;

        if (!item.over_18 || this.show_over_18) {
            if (isImageFile(item.url)) {
                this.appendImage(item);
            } else {
                this.enrichItem(item);
            }
            this.fetcherSawItem(item);
        } else {
            this.nsfwDiscarded++;
        }
    };    

    PicFetcher.prototype.handlePosts = function(data) {
        this.afterTag = data.data && data.data.after;
        if (!this.afterTag) {
            this.endOfReddit = true;
            return;
        }
        
        var self = this;
        $.each(data.data.children, function(i, item) {
            self.handleListing(item.data);
        });
        this.updateStatus();
        this.resetTimes();
    };
        
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
            });
        } else { // normal image
            var url = "http://api.imgur.com/2/image/" + id + ".json";
            
            $.getJSON(url, function(data) {
                item.url = data.image && data.image.links && data.image.links.original;
                self.appendImage(item);
            });        
        }
    };

    PicFetcher.prototype.getQuickMemeLink = function(item) {
        var split = item.url.split("/");
        var hash = split[split.length - 1];
        if ("" === hash)
            hash = split[split.length - 2]; // handle trailing slash
        if (hash.indexOf("?") != -1)
            hash = hash.slice(0, hash.indexOf("?"));
        
        item.url = "http://i.qkme.me/" + hash + ".jpg";
        this.appendImage(item);
    };

    PicFetcher.prototype.getYoutubeLink = function(item) {
        if(!this.show_videos)
            return;

        var videoIdRe = /.*v=([^&]*)/,
            videoId = videoIdRe.exec(item.url)[1];

        if(videoId) {
            var html = _.template($("#youtube-template").html())({videoId:videoId});
            this.appendHtml(item, html);
        } else {
            reddit.error("Can't parse youtube video!!!", item.url);
        }
    };

    // Export
    // ======

    // Classes:
    reddit.PicFetcher = PicFetcher;
    reddit.log = function() {
        if(typeof console == "undefined") return;
        var args = jQuery.makeArray(arguments);
        args.unshift("(reddit)");
        console.log.apply(console, args);
    };

    reddit.error = function() {
        if(typeof console == "undefined") return;
        var args = jQuery.makeArray(arguments);
        args.unshift("(reddit)");
        console.error.apply(console, args);        
    };
}(window);