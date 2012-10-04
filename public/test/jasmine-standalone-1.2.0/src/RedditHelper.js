
function getChild(type) {
	var child = {"kind": "t3", "data": 
					{"domain": "i.imgur.com", 
					"banned_by": null, 
					"media_embed": {}, 
					"subreddit": "starcraft", //  
					"selftext_html": null, 
					"selftext": "", 
					"likes": null, 
					"link_flair_text": null, 
					"id": "ysyza", 
					"clicked": false, 
					"title": "Hiding yo broods, standard TLO play.", //
					"num_comments": 38,  //
					"score": 339,  //
					"approved_by": null, // 
					"over_18": false,  //
					"hidden": false,  //
					"thumbnail": "http://d.thumbs.redditmedia.com/ZUvrAZw2KcwgpYfi.jpg",  //
					"subreddit_id": "t5_2qpp6", 
					"edited": false, 
					"link_flair_css_class": null, //
					"author_flair_css_class": "Z", // Starcaft only? 
					"downs": 81, //
					"saved": false, 
					"is_self": false, 
					"permalink": "/r/starcraft/comments/ysyza/hiding_yo_broods_standard_tlo_play/", //
					 "name": "t3_ysyza", 
					 "created": 1345925658.0, // 
//					 "url": "http://i.imgur.com/WLPMw.jpg", //
					 "author_flair_text": "", 
					 "author": "zmak", //
					 "created_utc": 1345900458.0,  //
					 "media": null,
					 "num_reports": null, 
					 "ups": 420 // 
					 }}; 
	child.data.permalink = "" + Math.random();

	switch(type) { 
		case "youtube": 
			child.data.url = "https://www.youtube.com/watch?v=" + Math.random() + "&amp;feature=plcp";
			break;
		case "image":
			child.data.url = "..//images/2.png";
			break;
		default:
		throw("Unknown type");		
	};

	return(child);
}

var permalinkCounter = 0;

function getListing(before) {
	if(!before) {before = null}
	var after = "" + permalinkCounter++;
	var children = [];
	while(children.length < 20) {children.push(getChild("image"))};
	var listing = {"kind": "Listing", "data": {"modhash": "", "children": children, "after": after, "before": before}}
	return(listing);
}