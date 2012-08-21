
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


function getReddits(subreddits, listView ) {

url = urlForSubreddits(subreddits, redditAfterTag)
console.log("sending the json - after = ", redditAfterTag )
$.getJSON(url, function(data) { 
	redditAfterTag = data.data.after;
	console.log( "Got data! #= ", data.data.children.length )

    $.each(data.data.children, function(i,item){
    	here = item.data
    	img = getImage( here )
    	if(undefined != img) {
			var $newContent = $('<div>' +
				//'<h3>'+ i + ': ' + here.title + '</h3>' +
				'<img src=' + here.url  +
				// note that not specifying the heights upfront seems to screw up where the spinner goes!  
				'width=100 height=100'+
				'>' +
				'</div>')
			listView.append($newContent);
		}
//        $("<img/>").attr("src", item.data.url).appendTo("#images");
    });
});

}