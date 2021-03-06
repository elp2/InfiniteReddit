var respondToKeys = true;

var DETAILS_PADDING_PX = 60,
    IMG_BORDER_PX = 5 * 2, 
    EXTRA_SPACE_PX = 20;

if(window.location.search == "?reset") {
    localStorage.clear();
}

var subReddits = [];

function getSubreddits() {
    var storedSubreddits = localStorage.storedSubreddits,
        reddits,
        hash;
    if(storedSubreddits) {
        reddits = JSON.parse(storedSubreddits);
        reddit.log("Using storedSubreddits: ", storedSubreddits);
        if(reddits.length)
            return(reddits);
    }

    hash = window.location.hash;
    if(undefined===hash){
        return([]);
    }
    hash = hash.slice(1);
    if(hash.length===0) {
        return([]);
    }
    reddits = hash.split("+");
    return(reddits);
}    

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

function resetSlides() {
    $("#swipeview-slider").remove();
    gallery = new SwipeView('#wrapper', {numberOfPages: 0, loop: false});

    slides = [];
    function resetClassName() { this.className=''; }
    for (i = 0; i < 3; i++) {
        var masterPage = $(gallery.masterPages[i]);
        if(masterPage.children().length === 0) {
            el = $($('#gallery-page').html());
            el.find("#htmlSpan").hide();
            el.find("#gallery-img").hide();

            el.find("#gallery-img").load(resetClassName); 
            masterPage.append(el);
        } else {
            masterPage.find("#htmlSpan").hide();
            masterPage.find("#gallery-img").hide();
            masterPage.find("#details").html("");
        }
    }
    $("#info-popup").show();
}

var gallery, 
el, 
span,
i, 
page, 
slides = [],
advanceOnReddit = false;

$(document).ready(function() {    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
        
    resetSlides();

    var onlineMode = window.location.search != "?test";
    picFetcher = new reddit.PicFetcher({onlineMode: onlineMode, 
                                        imgFn: addImg,
                                        htmlFn: addHtml,
                                        statusFn: updateStatus,
                                        show_over_18: localStorage.show_over_18==="on",
                                        show_videos: localStorage.show_videos==="on"
                                        });


    function resetSettings() {
        localStorage.clear();
        showSettings();
    }

    function updateStatus(consecutiveDiscarded, nsfwDiscarded, errorFetching, endOfReddit) {        
        var statusHTML = "";
        if(errorFetching) {
            statusHTML += "<p>" + errorFetching + " errors connecting to reddit.  Reload page or check settings to see if all reddits are correct.</p>";
            if(errorFetching===2) { statusHTML += "<p>>More errors... perhaps reddit or your internet is down.  If not then try changing your settings by clicking the link below.</p>"; }
        }
        if(consecutiveDiscarded > 10) {
            statusHTML += "<p>" + consecutiveDiscarded + " unshown items.  Maybe you have seen all new posts on this subreddit.  Come back later or change settings.</p>";
        }
        if(nsfwDiscarded > 10) {
            statusHTML += "<p>" + nsfwDiscarded + " NSFW items skipped. Turn on in settings to view</p>";
        }

        if(endOfReddit) {
            statusHTML += "<p>You have reached the end of reddit!  There are no new items to display.  Try a new set of subreddits or refresh later.</p>";
        }

        $("#loading-status").html(statusHTML);
    }

    function start() {
        subReddits = getSubreddits();
        if(subReddits.length) {
            picFetcher.setSubreddits(subReddits, localStorage["hnct-params"]);
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

    function offsetImg(img) {
        if(img.height()>$(window).height()-DETAILS_PADDING_PX - EXTRA_SPACE_PX - IMG_BORDER_PX) {
            img.offset({top:DETAILS_PADDING_PX });
        } else {
            var remainingSpace = $(window).height() - DETAILS_PADDING_PX;
            img.offset({top:DETAILS_PADDING_PX + (remainingSpace - img.height() - IMG_BORDER_PX) / 2});
        }

        // Firefox doesn't seem to take offset(left:) properly so use CSS.  This breaks other browsers
        var leftOffset = ($(window).width()/2 - img.width()/2)+ "px"
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            img.css({left: leftOffset});
        } else {
            img.offset({left: leftOffset});
        }
    }

    function putSlideAt(upcoming, i) {
        var slide = slides[upcoming] ? slides[upcoming] : {width: 250,height: 250,item:{url: ""}};
        picFetcher.userSawItem(slide.item);
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

            offsetImg(img);
        } 
        setDetails(details, slide.item);
    }
    
    gallery.onFlip(function() {
        var el, 
        slideIdx, 
        i;
        for (i = 0; i < 3; i++) {
            upcomingSlideIdx = gallery.masterPages[i].dataset.upcomingPageIndex;
            
            if (upcomingSlideIdx != gallery.masterPages[i].dataset.pageIndex) {
                putSlideAt(upcomingSlideIdx, i); // update this page's content to the upcoming
            }
        }
    
        // When we flipped via a drag we need to let the picFetcher know
        if(-1 == gallery.directionX) { // forwards
            // TODO: handle case where we didn't actually advance
            picFetcher.advance();
        } else if(1 == gallery.directionX) {
            picFetcher.retreat();
        }
    });

    gallery.onMoveOut(function() {
        gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
    });
    
    gallery.onMoveIn(function() {
        var className = gallery.masterPages[gallery.currentMasterPage].className;
        if( !(/(^|\s)swipeview-active(\s|$)/.test(className)) ) {
            gallery.masterPages[gallery.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active';            
        }
    });

    function advanceImg() {
        resetImageSize(getCurrentImage());

        if(!gallery.next()){
            advanceOnReddit = true;
            $("#info-popup").show();
        } else {
            picFetcher.advance();
        }
    }

    function retreatImg() {
        resetImageSize(getCurrentImage());
        if(gallery.prev()) {
            picFetcher.retreat();
        }
    }

    $(document).keydown(function(event) {
        if (!respondToKeys)
            return;
        if(event.ctrlKey || event.altKey || event.metaKey)
            return;
        if(0===slides.length)
            return;
        
        var img = getCurrentImage();

        var jCode = 74, kCode = 75, lCode = 76, aCode = 65, sCode = 83, dCode = 68, spaceCode = 32,
        leftCode = 37, upCode = 38, rightCode = 39, downCode = 40;

        switch(event.which) {
            case jCode:
            case aCode:
            case rightCode:
                advanceImg();
                break;
            
            case kCode:
            case sCode:
            case leftCode:
                retreatImg();
                break;

            case upCode:
                if (null === img.data('orig-top')) {
                    img.data('orig-top', img.offset().top);
                }
                
                if(img.offset().top === img.data('orig-top')) {
                    retreatImg();
                } else {
                    img.offset({top: Math.min( (img.offset().top + $(window).height()/2),
                                                img.data('orig-top')
                    )});
                }
                break;

            case spaceCode:
            case downCode:
                if (null === img.data('orig-top')) {
                    img.data('orig-top', img.offset().top);
                }
                
                var imgBottom = img.offset().top + img.height(), 
                bottomOffScreen = $(window).height() < imgBottom;
                if (bottomOffScreen) {
                    img.offset({top: img.offset().top - $(window).height()/2});
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
                offsetImg(img);
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
        var acceptableShrink = 0.5;
        var maxHeight = $(window).height() - DETAILS_PADDING_PX - IMG_BORDER_PX - EXTRA_SPACE_PX;
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

    $('#subredditsTypeahead')
    .typeahead({source:typeaheadSource, 
        menu: '<ul class="typeahead dropdown-menu" style="z-index: 100000"></ul>',
        matcher: function (item) {
            return 0===item.toLowerCase().indexOf(this.query.toLowerCase());
        }
    })
    .change(function(event){
        var val = $(this).val();

        if(val.length > 2)  { 
            var bgh = $("#buttonsGoHere");
            if(0===bgh.find(".subreddit-" + val).length)
            {
                var allButton = bgh.find(".subreddit-All");
                allButton.remove();

                bgh.append(subredditButton(val));
                $(this).val("");
            }
        }
        event.preventDefault();
        event.stopPropagation();
    }
    ); 

    $("#modalForm") // prevent the auto-submitting of the form on enter
    .submit(function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

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

    var filtered = SFWReddits.filter(function(sub){return( -1 == alreadySelected.indexOf(sub));});
    cbFn(filtered);
}

function subredditButton(subreddit) {
    var button = $("<button />")
    .addClass("btn")
    .addClass("btn-mini")
    .addClass("subreddit-" + subreddit)
    .data("subreddit", subreddit)
    .html(subreddit + " - X")
    .click(function(e) { if(e.clientX!==0 && e.clientY!==0) { $(this).remove(); } }); // get spurious clicks at 0,0 when submitting without typeahead

    return(button);     
}

function getButtonData(params) {
    for(var paramName in params) {
        var group = $("#" + paramName);
        var active = group.find(".active");
        params[paramName] = active.data("ifset");
    }
    return params;
}

function allButtonClicked() {
    $.each($("#buttonsGoHere").children(), function(){$(this).remove();});

    $("#buttonsGoHere").append(subredditButton("All"));
}

function setButtonData(params) {
    for(var group in params) {
        var val = params[group];
        group = $("#" + group);
        var toActivate = group.find("[data-ifset='" + val + "']");
        if(toActivate.length) {
            toActivate.addClass("active");
        } else {
        }
    }
}

var defaultParams = { 
    "hnct-params": "hot",
    "nsfw-params":  "off"
};

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
    respondToKeys = false;
    var params = getParams();
    setButtonData(params);

    var subReddits = getSubreddits();
    var bgh = $("#buttonsGoHere");
    for (var i = bgh.children().length - 1; i >= 0; i--) {
        $(bgh.children()[i]).remove();
    }
    for (i = subReddits.length - 1; i >= 0; i--) {
        bgh.append(subredditButton(subReddits[i]));
    }
    $("#settingsModal").modal( {backdrop: "static", keyboard: false });
}

function getModalSubreddits() {
    var subReddits = [];

    var bgh = $("#buttonsGoHere");
    for (var i = bgh.children().length - 1; i >= 0; i--) {
        var child = $(bgh.children()[i]);
        subReddits.push(child.data("subreddit"));
    }
    return(subReddits);
}

function saveSettings() {
    mixpanel.track("Saved settings");
    $.each($("#formErrors").children(), function(){$(this).remove();});

    var settings = getButtonData(defaultParams);
    for(var key in settings) {
        localStorage[key] = settings[key];
    }

    picFetcher.setShow_Videos(settings["video-params"]==="on");
    picFetcher.setShow_over_18(settings["nsfw-params"]==="on");

    subReddits = getModalSubreddits();

    if(!subReddits.length) {
        $("#formErrors")
        .append($('<div id="pickOneSubreddit" class="alert alert-error">Please pick at least one Subreddit</div>'));

        return;
    }

    picFetcher.setSubreddits(subReddits, settings["hnct-params"]);
    localStorage.storedSubreddits = JSON.stringify(subReddits);

    $("#settingsModal").modal("hide"); 
    respondToKeys = true;
    resetSlides();
}
