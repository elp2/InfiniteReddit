$(document).ready(function() {    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    
    var gallery, 
    el, 
    span,
    i, 
    page, 
    loadingSlide = {html: $("#loading-slide").html(), loading: true, item: {}},
    slides = []
    ;
    
    gallery = new SwipeView('#wrapper', {numberOfPages: slides.length,loop: false});

    // Load initial data
    for (i = 0; i < 3; i++) {
        page = i == 0 ? slides.length - 1 : i - 1;

        el = $($('#gallery-page').html());
        $(gallery.masterPages[i]).append(el);

        el.find("#gallery-img").load(function() {this.className='';}); 
    }
    addSlide(loadingSlide);
    
    var detailsTemplate = $('#details-template').html();
    function setDetails(details, item) {
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
        if(slide.loading) {
            details.html("Loading");
        } else
            setDetails(details , slide.item);
    }
    
    gallery.onFlip(function() {
        var el, 
        upcoming, 
        i;
        
        for (i = 0; i < 3; i++) {
            upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
            
            if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
                putSlideAt(upcoming, i);
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

    $(document).keydown(function(event) {
        if (!respondToKeys)
            return;
        
        function resetImageSize() {
            img.width(img.data('orig-width'));
            img.height(img.data('orig-height'));
            var origTop = img.data('orig-top');
            if (null != origTop) {
                img.offset({top: origTop});
                img.data('orig-top', null);
            }
        }
        
        var img = $(gallery.masterPages[gallery.currentMasterPage]).find("#gallery-img"); 
        function advanceImg() {
            resetImageSize();
            picFetcher.getMorePosts(); // TODO: rely on throttling for now.  Find a better way!

            if(slides[slides.length-1]!=loadingSlide) {
                addSlide(loadingSlide);
            }            
            gallery.next();
        }
        var jCode = 74, kCode = 75, lCode = 76, aCode = 65, sCode = 83, dCode = 68, spaceCode = 32;
        switch (event.which) {
            case jCode:
            case aCode:
                advanceImg();
                break;
            
            case kCode:
            case sCode:
                resetImageSize();
                gallery.prev();
                break;
            
            case spaceCode:
                if (null == img.data('orig-top')) {
                    img.data('orig-top', img.offset().top);
                }
                
                var imgBottom = img.offset().top + img.height(), 
                bottomOffScreen = $(window).height() < imgBottom;
                if (bottomOffScreen) {
                    img.offset({top: img.offset().top - $(window).height()});
                } else {
                    advanceImg();
                }
                //TODO: make these more easily pageable by an integer number of times
                // TODO: advance down the image if it's super tall, advance to next if we're at the bottom / it was already visible
                break;
            
            case dCode:
            case lCode:
                var zoomed = img.width() != img.data('orig-width');                
                if (zoomed) {
                    img.width(img.data('orig-width'));
                    img.height(img.data('orig-height'));
                } else {
                    if (null != img.data('orig-top')) {
                        img.offset({top: img.data('orig-top')})
                    }
                    var zoomedSize = fitToWindow(img, true);

                    img.width(zoomedSize.width);
                    img.height(zoomedSize.height);
                }
                break;
                
                break;
        }
    });
    
    function addSlide(slide) {
        var newPageI = gallery.options.numberOfPages;
        if(loadingSlide === slides[newPageI-1]) {
            slides[newPageI-1] = slide; // Loading Slide replaced with the new slide
        } else {
            gallery.updatePageCount(newPageI + 1);
            slides.push(slide);
        }

        if(slides.length<=2) {
            var upcomingSlide = slides.length-1;
            var galleryPage = slides.length;
            putSlideAt(upcomingSlide,galleryPage);
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

    var onlineMode = window.location.toString().split("#")[1] != "test";
    picFetcher = new reddit.PicFetcher({onlineMode: onlineMode, 
                                        imgFn: addImg,
                                        htmlFn: addHtml
                                        });
    picFetcher.setSubreddits(getSubreddits());
    
    function start() {
        picFetcher.getMorePosts()
    }
    var startDelay = onlineMode ? 0 : 100;
    setTimeout(start, startDelay);
    
    function getSubreddits() {
        var reddits = window.location.toString().split("?")[1];
        if (undefined == reddits)
            return (["all"])
        return (reddits.split("+"))
    }

    // TODO: Tie into actual settings
    var configHtml = _.template($('#settings-modal').html())();
    $('#wrapper').avgrund({
        height: 400,
        holderClass: 'custom',
        showClose: true,
        showCloseText: 'OK',
        enableStackAnimation: true,
        onBlurContainer: '.container',
        template: configHtml,
        onActivate: function() {
            respondToKeys = false
        },
        onDeactivate: function() {
            respondToKeys = true
        },
    });
// end document ready
});