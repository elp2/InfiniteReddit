
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function urlForSubreddits(subreddits, after ) {

	// http://www.reddit.com/r/starcraft/.json?jsonp=?&after=t3_yjbu1
	redditsURLBase = "http://www.reddit.com/r/"
	redditURLJsonEnding = "/.json?jsonp=?"

	url = redditsURLBase
	url = url + subreddits.join("+") 
	url = url + redditURLJsonEnding
	if( after.length > 0 )
		url = url + "&after=" + after

	console.log("URL=", url)
	return url
}

function getImage(item) {
	console.log("Parsing: ", item.url)
	if(!shouldShowImage(item))
		return undefined

	console.log("showing: ", item.url)
	return item
}

redditAfterTag = ""

seenURLs = {}
cbURLs = {}

showOver18 = false;
numOver18Skipped = 0;
function skippedOver18(item) {
	console.log("skipping over_18")
	numOver18Skipped++;
}

function nonImageExtension(item) {
	console.log("Can't handle URL: ", item.url)
}

function shouldShowImage(item) {
	if(undefined == item)
		return false

	imageExtensions = [ "png", "jpg", "jpeg", "gif" ];
	hasImageExtension = false;
	for (var i = imageExtensions.length - 1; i >= 0; i--) {
		hasImageExtension = item.url.toLowerCase().endsWith(imageExtensions[i]) || hasImageExtension;
	};
	if(!hasImageExtension) {
		nonImageExtension(item);
		return false
	}

	if(true == item.over_18 && !showOver18) {
		skippedOver18(item);
		return false;
	}

	return true
}

function createImage( listView, img ) {

	// moving into its own function seems to have resolved an issue where img would become undefined in the CB
	if(undefined == img || undefined != seenURLs[img.url])
		return undefined;

	seenURLs[img.url] = true;

	console.log("Creating Image CB for:", img.url)
	// Insert preloaded image after it finishes loading
	$('<img />')
	    .attr('src', img.url)
	    .load(function(){
	    		imgTag = '<img src=' + img.url;

	    		scaledWidth = this.width;
	    		maxWidth = $(window).width() - 30
	    		scaledWidth = Math.min(maxWidth, this.width);
	    		scaledHeight = this.height * ( scaledWidth / this.width )


	    		imgTag = imgTag + " width=" + scaledWidth+ " height=" + scaledHeight
	    		imgTag = imgTag + ' >';
	    		// TOOD: Better jQuery way to construct/add this?
	    		// TODO: Make headers wrap properly
	    		listView.append($(	
	    			'<div class="matte-media-box pug-box>' + 
									'<h4>' + img.title + '</h4>'+
									imgTag +
									'</div>' 
									))

				if( undefined != cbURLs[img.url] ) { console.error( img.url, ": in the callback after loading - duplicate seen!"); }
				cbURLs[img.url] = true;
	    });
}

maxAddedImages = 2;
addedImg = 0;
function getReddits(subreddits, listView ) {
	url = urlForSubreddits(subreddits, redditAfterTag)
	console.log("sending the json - after = ", redditAfterTag )
	$.getJSON(url, function(data) { 
		redditAfterTag = data.data.after;
		// TODO: possible for after to become empty after a while ... "after": null, "before": null
		console.log("Got ", data.data.children.length, " children.  After=", redditAfterTag);

	    $.each(data.data.children, function(i,item){

	    	here = item.data
	    	var img = getImage( here )
	    	if(img&& addedImg < maxAddedImages) {
		    	createImage(listView, img)
		    	addedImg++;
			}
	    });
    })
}