
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

	if( !item.url.endsWith("png") && !item.url.endsWith("jpg") && !item.url.endsWith("jpeg") )
		return undefined

	return item
}

redditAfterTag = ""

seenURLs = {}
cbURLs = {}

function createImage( listView, img ) {

	// moving into its own function seems to have resolved an issue where img would become undefined in the CB
	if(undefined == img || undefined != seenURLs[img.url])
		return undefined;

	seenURLs[img.url] = true;

	console.log("adding2: ", img.url)
	// Insert preloaded image after it finishes loading
	$('<img />')
	    .attr('src', img.url)
	    .load(function(){
	    		//div = $('<div />');
	    		
	    		//div.append(this);
	    		//listView.append(div);
	    		listView.append($("<h1>" + img.title + "</h1>"));
				listView.append($(this));

				if( undefined != cbURLs[img.url] ) { console.log( img.url, ": in the callback after loading - duplicate seen!: ", img.url); }
				cbURLs[img.url] = true;
	    });
/*
	var $newContent = $('<div>' +
		//'<h3>'+ i + ': ' + here.title + '</h3>' +
		'<img src=' + here.url  +
		// note that not specifying the heights upfront seems to screw up where the spinner goes!  
		'width=100 height=100'+
		'>' +
		'</div>')
	listView.append($newContent);
	*/

}

function getReddits(subreddits, listView ) {
	url = urlForSubreddits(subreddits, redditAfterTag)
	console.log("sending the json - after = ", redditAfterTag )
	$.getJSON(url, function(data) { 
		redditAfterTag = data.data.after;
		// TODO: possible for after to become empty after a while ... "after": null, "before": null

		console.log( "Got data! #= ", data.data.children.length )

	    $.each(data.data.children, function(i,item){
	    	here = item.data
	    	var img = getImage( here )
	    	createImage(listView, img)
	    });
    })
}