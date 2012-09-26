// TODO: Proper list of defaults
var defaultReddits = [ "All", "AdviceAnimals", "announcements", "AskReddit", "atheism", "aww", "bestof", "blog", "funny", "gaming", "IAmA", "movies", "Music", "pics", "politics", "science", "technology", "todayilearned", "videos", "worldnews", "WTF"]; // from /reddits 22Sep12
var respondToKeys = true;

$(document).ready(function() {    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    
    var gallery, 
    el, 
    span,
    i, 
    page, 
    slides = [],
    advanceOnReddit = false;

    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    
    gallery = new SwipeView('#wrapper', {numberOfPages: slides.length,loop: false});

    // Load initial data
    for (i = 0; i < 3; i++) {
        page = i === 0 ? slides.length - 1 : i - 1;

        el = $($('#gallery-page').html());
        el.find("#htmlSpan").hide();
        el.find("#gallery-img").hide();
        $(gallery.masterPages[i]).append(el);

        el.find("#gallery-img").load(function() {this.className='';}); 
    }

    var onlineMode = window.location.search != "?test";
    picFetcher = new reddit.PicFetcher({onlineMode: onlineMode, 
                                        imgFn: addImg,
                                        htmlFn: addHtml,
                                        show_over_18: localStorage["show_over_18"],
                                        show_videos: localStorage["show_videos"]
                                        });

    function start() {
        var subReddits = getSubreddits();
        if(subReddits.length) {
            picFetcher.setSubreddits(subReddits);
        } else {
            showSettings();
        }
    }
    var startDelay = onlineMode ? 0 : 100;
    setTimeout(start, startDelay);

    var detailsTemplate = $('#details-template').html();
    function setDetails(details, item) {
        item.localTimeAgo = moment.unix(item.created_utc).fromNow();
        details.html(_.template(detailsTemplate, item, {variable:"item"}));
    }

    function putSlideAt(upcoming, i) {
        var slide = slides[upcoming] ? slides[upcoming] : {width: 250,height: 250,item:{url: ""}};
        
        var page = $(gallery.masterPages[i]),
            htmlSpan = page.find("#htmlSpan"),
            img = page.find("#gallery-img"),
            details = page.find("#details");

        if (slide.html) {
            img.hide();
            
            htmlSpan.show();
            htmlSpan.html(slide.html);
        } else {
            htmlSpan.hide();
            htmlSpan.html("");

            img.show();
            img.attr('src', slide.url)
            .attr('className', 'loading')
            .width(slide.width)
            .height(slide.height)
            .data('orig-width', slide.width)
            .data('orig-height', slide.height)
            .data('orig-top', null) // Need to set a null so that it can be persisted.  Can't data set undefined although it's the beginning state
            ;          
        } 
        setDetails(details, slide.item);
    }
    
    gallery.onFlip(function() {
        var el, 
        slideIdx, 
        i;
        for (i = 0; i < 3; i++) {
            slideIdx = gallery.masterPages[i].dataset.upcomingPageIndex;
            if (slideIdx != gallery.masterPages[i].dataset.pageIndex) {
                putSlideAt(slideIdx, i);
            }
        }
    });
    
    gallery.onMoveOut(function() {
        gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
    });
    
    gallery.onMoveIn(function() {
        var className = gallery.masterPages[gallery.currentMasterPage].className;
        /(^|\s)swipeview-active(\s|$)/.test(className) || (gallery.masterPages[gallery.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active');
    });


    function getCurrentImage() { return($(gallery.masterPages[gallery.currentMasterPage]).find("#gallery-img")); }

    function resetImageSize(img) {
        img.width(img.data('orig-width'));
        img.height(img.data('orig-height'));
        var origTop = img.data('orig-top');
        if (null !== origTop) {
            img.offset({top: origTop});
            img.data('orig-top', null);
        }
    }

    function advanceImg() {
        resetImageSize(getCurrentImage());
        picFetcher.advance();

        if(!gallery.next()){
            advanceOnReddit = true;
            $("#info-popup").show();
        }
    }

    function retreatImg() {
        resetImageSize(getCurrentImage());
        picFetcher.retreat();
        gallery.prev();
    }


    $(document).keydown(function(event) {
        if (!respondToKeys)
            return;
        
        var img = getCurrentImage();

        var jCode = 74, kCode = 75, lCode = 76, aCode = 65, sCode = 83, dCode = 68, spaceCode = 32;
        switch (event.which) {
            case jCode:
            case aCode:
                advanceImg();
                break;
            
            case kCode:
            case sCode:
                retreatImg();
                break;
            
            case spaceCode:
                if (null === img.data('orig-top')) {
                    img.data('orig-top', img.offset().top);
                }
                
                var imgBottom = img.offset().top + img.height(), 
                bottomOffScreen = $(window).height() < imgBottom;
                if (bottomOffScreen) {
                    img.offset({top: img.offset().top - $(window).height()});
                } else {
                    advanceImg();
                }
                break;
            
            case dCode:
            case lCode:
                var zoomed = img.width() != img.data('orig-width');                
                if (zoomed) {
                    img.width(img.data('orig-width'));
                    img.height(img.data('orig-height'));
                } else {
                    if (null !== img.data('orig-top')) {
                        img.offset({top: img.data('orig-top')});
                    }
                    var zoomedSize = fitToWindow(img, true);

                    img.width(zoomedSize.width);
                    img.height(zoomedSize.height);
                }
                break;
        }
    });
    
    function addSlide(slide) {
        $("#info-popup").hide();

        var newPageI = gallery.options.numberOfPages,
            forceRefresh = slides.length <= 2 ? true : false;

        gallery.updatePageCount(newPageI + 1);
        slides.push(slide);

        if(forceRefresh) {
            putSlideAt(slides.length-1, (slides.length)%3);
        }

        if(advanceOnReddit) {
            advanceOnReddit = false;
            advanceImg();
        }
    }

    function fitToWindow(img, forceShrink) {
        img = $(img);
        var maxWidth = $(window).width() - 30;
        var scaledWidth = Math.min(maxWidth, img.width());
        var scaledHeight = img.height() * (scaledWidth / img.width());

        // Shrink things if doing so slightly will make them fit completely on the page
        var acceptableShrink = 0.75;
        var maxHeight = $(window).height() - 70*2; // TODO: This is 2x the titlebar... move its centering down 64px to save 64px on the bottom
        if(forceShrink || (maxHeight < scaledHeight && maxHeight / scaledHeight > acceptableShrink)) {
            var newWidth = scaledWidth * (maxHeight / scaledHeight);
            if(newWidth<maxWidth) {
                scaledWidth = newWidth;
                scaledHeight = maxHeight;
            }
        }

        return({width:scaledWidth, height:scaledHeight});
    }

    function addHtml(item, html) {
        addSlide({html: html, item: item});
    }

    function addImg(item, img)
    {
        var fittedSize = fitToWindow(img);
        addSlide({url: item.url, width: fittedSize.width, height: fittedSize.height, item: item});
    }

    function getSubreddits() {
        var storedSubreddits = localStorage["storedSubreddits"],
            reddits,
            hash;
        if(storedSubreddits) {
            reddits = JSON.parse(storedSubreddits);
            reddit.log("Using storedSubreddits: ", storedSubreddits);
            if(reddits.length)
                return(reddits);
        }

        var hash = window.location.hash;
        if(undefined==hash){
            return([]);
        }
        hash = hash.slice(1);
        if(hash.length==0) {
            return(["all"]);
        }
        console.log("reddits: ", reddits)
        reddits = hash.split("+");
        return(reddits);
    }    

    $('#subredditsTypeahead')
    .typeahead({source:typeaheadSource})
    .change(function(event){
        var val = $(this).val();
        if(val.length > 2)  { 
            var bgh = $("#buttonsGoHere");
            if(0==bgh.find(".subreddit-" + val).length)
            {
                bgh.append(subredditButton(val));
                $(this).val("");
            };
        }
        event.preventDefault();
        event.stopPropagation();
    }
    ); // NOTE: Before when this was .on( "change") it would reload the page if I picked an element < 2 chars.. still happening on Safari apparently

// end document ready
});

// Settings Modal Related

function typeaheadSource(query, cbFn) {
    var bgh = $("#buttonsGoHere");
    var completions = [];
    var alreadySelected = [];
    for (var i = bgh.children().length - 1; i >= 0; i--) {
        var child = $(bgh.children()[i]);
        alreadySelected.push(child.data("subreddit"));
    }

    var filtered = defaultReddits.filter(function(sub){return( -1 == alreadySelected.indexOf(sub))});
    cbFn(filtered);
}

function subredditButton(subreddit) {
    // TODO: Add a proper "x"
    var button = $("<button />")
    .addClass("btn")
    .addClass("btn-mini")
    .addClass("subreddit-" + subreddit)
    .data("subreddit", subreddit)
    .html(subreddit + "  X")
    .click(function() { $(this).remove() });

    return(button);     
}

function getButtonData(params) {
    for(var group in params) {
        group = $("#" + group);
        active = group.find(".active");
        params[group] = active.data("ifset");
    }
    return;
}

function setButtonData(params) {
    for(var group in params) {
        var val = params[group];
        group = $("#" + group);
        var toActivate = group.find("#" + val );
        if(toActivate.length) {
            console.log("activating", toActivate);
            toActivate.addClass("active");
        } else {
            console.log("Can't activea????");
            debugger;
        }
    }
}

var defaultParams = { 
//    "zoom-params":  "always",
    "video-params": "off",
    "nsfw-params":  "off",
}

function getParams() {
    var params = defaultParams;
    for(var param in defaultParams) {
        if(localStorage[param]) {
            params[param] = localStorage[param];
        }
    }
    return(params);
}

function showSettings() {
    console.log("settings!");
    var params = getParams();
    console.log(params);
    setButtonData(params);
    $("#settingsModal").modal();
}

function saveSettings() {
    var settings = getButtonData(defaultParams);
    console.log("settings!", settings);
    for(var key in settings) {
        localStorage[key] = settings[key];
    }

    picFetcher.setShow_Videos(settings["video-params"]==="on");
    picFetcher.setShow_over_18(settings["nsfw-params"]==="on");
}
