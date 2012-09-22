// TODO: Proper list of defaults
defaultReddits = [ "all", "Pics", "funny", ];
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
    var respondToKeys = true;


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
            scaledWidth = scaledWidth * (maxHeight / scaledHeight);
            scaledHeight = maxHeight;
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
        hash = hash.substring(hash.indexOf("#")+1);
        if(hash.length==0) {
            return([]);
        }

        reddits = hash.split("+");
        return(reddits);
    }    

    function showSettings() {
        // TODO: Build up settings HTML
        // TODO: Show it
    }

    function saveSettings() {
        // TODO: Save subreddits and put in hash without refreshing
        // TODO: fill in vals

        picFetcher.setShow_Videos();
        picFetcher.setShow_over_18();
    }
// end document ready
});