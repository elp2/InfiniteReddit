var firstImages = 0;
$(document).ready(function() {
    
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    
    var gallery, 
    el, 
    i, 
    page, 
    slides = [
    ];
    
    gallery = new SwipeView('#wrapper', {numberOfPages: slides.length,loop: false});

    // Load initial data
    for (i = 0; i < 3; i++) {
        page = i == 0 ? slides.length - 1 : i - 1;
        // TODO: switch to templating
        el = document.createElement('img');
        el.className = 'loading';
        el.src = "";
        el.width = 250;
        el.height = 250;
        el.onload = function() {
            this.className = '';
        }
        gallery.masterPages[i].appendChild(el);
        
        el = document.createElement('span');
        el.innerHTML = "";
        gallery.masterPages[i].appendChild(el);
    }
    
    function putSlideAt(upcoming, i) {
        var slide = slides[upcoming] ? slides[upcoming] : {url: "",width: 250,height: 250,desc: ""};
        
        if (slide.html) {
        
        } else {
            
            el = gallery.masterPages[i].querySelector('img');
            var img = $(el);
            img.attr('src', slide.url)
            .attr('className', 'loading')
            .width(slide.width)
            .height(slide.height)
            .data('orig-width', slide.width)
            .data('orig-height', slide.height)
            .data('orig-top', null) // Need to set a null so that it can be persisted.  Can't data set undefined although it's the beginning state
            ;
            
            el = gallery.masterPages[i].querySelector('span');
            el.innerHTML = slide.desc;
        }
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
        console.log("onMoveOut");
        gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
    });
    
    gallery.onMoveIn(function() {
        console.log("onMoveIn");
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
        
        var img = $(gallery.masterPages[gallery.currentMasterPage].querySelector('img')); // Replace with JQuery selector
        globalimg = img;
        function advanceImg() {
            resetImageSize();
            picFetcher.getMorePosts(); // TODO: rely on throttling for now.  Find a better way!
            if (!gallery.next()) {
            // TODO: Show some kind of loading screen... maybe let it advance 1 and then replace it as the image comes in
            }
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
                    
                    var maxHeight = $(window).height() - 30;
                    if (maxHeight < img.height()) {
                        img.width(img.width() * maxHeight / img.height());
                        img.height(maxHeight);
                    }
                }
                break;
                
                break;
        }
    });
    
    
    
    function addImage(img, w, h, advanceToNext) {
        var el, 
        newPageI = gallery.options.numberOfPages;
        
        gallery.updatePageCount(newPageI + 1);
        slides.push({url: img.url,width: w,height: h,desc: img.title});

        // Special case to get the first images out there.  
        if (1 == firstImages) {
            putSlideAt(1, 2);
            firstImages++;
        } else if (0 == firstImages) {
            putSlideAt(0, 1);
            firstImages++;
        }
    }
    ;
    
    function addHTML(item, html) {
        var el, 
        newPageI = gallery.options.numberOfPages;
        
        gallery.updatePageCount(newPageI + 1);
        slides.push({html: html,desc: img.title});
        if (1 == firstImages) {
            putSlideAt(1, 2);
            firstImages++;
        } else if (0 == firstImages) {
            putSlideAt(0, 1);
            firstImages++;
        }
    
    }
    
    var onlineMode = window.location.toString().split("#")[1] != "test";
    picFetcher = new reddit.PicFetcher({onlineMode: onlineMode,imgFn: addImage,htmlFn: addHTML})
    picFetcher.setSubreddits(getSubreddits());
    
    function start() {
        picFetcher.getMorePosts()
    }
    ;
    var startDelay = onlineMode ? 0 : 100;
    setTimeout(start, startDelay);
    
    function getSubreddits() {
        var reddits = window.location.toString().split("?")[1];
        if (undefined == reddits)
            return (["all"])
        return (reddits.split("+"))
    }

    // TODO: Link this to a settings image.  Prevent normal CB's from happening from keypresses
    var configHtml = _.template($('#settings-modal').html())();
    console.log(configHtml);
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