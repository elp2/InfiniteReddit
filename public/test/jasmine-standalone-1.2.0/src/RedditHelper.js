
function getChild() {
	var child = {"kind": "t5", "data": {"display_name": "pics", "header_img": "http://c.thumbs.redditmedia.com/cqqKDqD3imcNj2iV.png", "title": "/r/Pics", "url": "/r/pics/", "description": "### [**Looking for an image subreddit with minimal rules? Check out /r/images**](http://www.reddit.com/r/images) ###\n\nA place to share interesting photographs and pictures. Feel free to post your own, but please **read the rules first** (see below), and note that we are *not a catch-all* for general images (of screenshots, comics, etc.)\n\n#Spoiler code#\n\nPlease mark spoilers like this:  \n`[text here](/spoiler)`\n\nHover over to [read](/spoiler).\n\n#Rules#\n\n1. **No screenshots, or pictures with added or superimposed text.** *This includes [image macros](http://en.wikipedia.org/wiki/Image_macro), comics, info-graphics and most diagrams. Text (e.g. a URL) serving to credit the original author is exempt.*\n\n1. **No gore or porn.** *NSFW content must be tagged.*\n\n1. **No personal information.** *This includes anything hosted on Facebook's servers, as they can be traced to the original account holder. Stalking &amp; harassment will not be tolerated.*\n\n1. **No solicitation of votes (including \"cake day\" posts), posts with their sole purpose being to communicate with another redditor, or [FIXED] posts.** *DAE posts go in /r/DoesAnybodyElse. \"Fixed\" posts should be added as a comment to the original image.*\n\n1. **Submissions must link directly to a specific image file or to an image hosting website with minimal ads.** *We do not allow blog hosting of images (\"blogspam\"), but links to albums on image hosting websites are okay. URL shorteners are prohibited.*\n\n* If your submission appears to be filtered but **definitely** meets the above rules, [please send us a message](/message/compose?to=%23pics) with a link to the **comments section** of your post (not a direct link to the image). **Don't delete it**  as that just makes the filter hate you! \n\n* If you come across any rule violations,  please report the submission or  [message the mods](http://www.reddit.com/message/compose?to=%23pics) and one of us will remove it!\n\nPlease also try to come up with **original post titles**. Submissions that use certain clich\u00e9s/memes will be automatically tagged with a warning.\n\n#Links#\nIf your post doesn't meet the above rules, consider submitting it on one of these other subreddits:\n\nComics | &amp;#0160;\n:---|:---\n/r/comics | /r/webcomics\n/r/vertical | [/r/f7u12](/r/fffffffuuuuuuuuuuuu/)\n/r/ragenovels | /r/AdviceAtheists \n**Image macros**|**Screenshots/text**\n/r/lolcats | /r/screenshots\n/r/AdviceAnimals | /r/desktops\n/r/Demotivational | /r/facepalm (Facebook)\n/r/reactiongifs | /r/DesktopDetective\n**Wallpaper**|**Animals**\n/r/wallpaper | /r/aww\n/r/wallpapers | /r/cats\n[The SFWPorn Network](http://www.reddit.com/r/earthporn+villageporn+cityporn+spaceporn+waterporn+abandonedporn+animalporn+humanporn+botanicalporn+adrenalineporn+destructionporn+movieposterporn+albumartporn+machineporn+newsporn+geekporn+bookporn+mapporn+adporn+designporn+roomporn+militaryporn+historyporn+quotesporn+skyporn+fireporn+infrastructureporn+macroporn+instrumentporn+climbingporn+architectureporn+artporn+cemeteryporn+carporn+fractalporn+exposureporn+gunporn+culinaryporn+dessertporn+agricultureporn+boatporn+geologyporn+futureporn+winterporn) | /r/TrollingAnimals\n&amp;#0160; | /r/deadpets\n&amp;#0160; | /r/birdpics\n&amp;#0160; | /r/foxes\n**Photography**|**Un-moderated pics**\n/r/photography | /r/AnythingGoesPics\n/r/photocritique | /r/images\n/r/HDR |\n/r/windowshots | \n/r/PictureChallenge |\n**Misc**|**New reddits**\n/r/misc |  /r/britpics \n/r/gifs | [Imaginary Network](http://reddit.com/r/ImaginaryLandscapes+ImaginaryMonsters+ImaginaryCharacters+ImaginaryTechnology)\n/r/dataisbeautiful |  /r/thennnow\n/r/picrequests | /r/SpecArt\n |  /r/LookWhoIMet\n&amp;#0160; |  /r/timelinecovers\n&amp;#0160; |  /r/MemesIRL \n&amp;#0160; |  /r/OldSchoolCool\n&amp;#0160; | /r/photoshopbattles\n\nAlso check out http://irc.reddit.com\n ", "created": 1201221069.0, "created_utc": 1201221069.0, "header_size": [150, 56], "over18": false, "subscribers": 2406640, "accounts_active": null, "public_description": "A place to share interesting photographs and pictures.", "header_title": "2 Million! Logo by corvuskorax", "id": "2qh0u", "name": "t5_2qh0u"}};
	child.data.permalink = "" + Math.random();
	return(child);
}

function getListing(before) {
	if(!before) {before = null}
	var after = "" + Math.random();
	var children = [];
	while(children.length < 20) {children.push(getChild())};
	var listing = {"kind": "Listing", "data": {"modhash": "", "children": children, "after": after, "before": before}}
	return(child);
}