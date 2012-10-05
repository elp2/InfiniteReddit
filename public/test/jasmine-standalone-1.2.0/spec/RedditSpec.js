describe("Reddit.RedditHelper", function() {
  var listing, before;
  beforeEach(function() {
    before = "before";
    listing = getListing(before);
  })
  it("creates proper sample reddit listing", function() {
    expect(listing.data.children.length).toBeGreaterThan(0);
    expect(listing.data.before).toEqual(before);
  });

  it("creates proper children", function() {
    var child = getChild("image");
    expect(child.data.url.endsWith("jpg"));

    child = getChild("youtube");
    expect(child.data.url).toContain("youtube");

    var invalidType = function() { getChild("unknown") };
    expect(invalidType).toThrow("Unknown type");
  })
})

describe("Reddit.PicFetcher", function() {
  var picFetcher, before, listing, imgFnItems, htmlFnItems, imgItem, htmlItem;

  function imgFn(item, img) {
    reddit.log("imgFn: ", item.permalink);
    imgFnItems.push(item);
  }
  function htmlFn(item, html){
    reddit.log("htmlFn:", item.permalink);
    htmlFnItems.push(item);
  }
  beforeEach(function() {
    picFetcher = new reddit.PicFetcher({onlineMode: false, 
                                        imgFn: imgFn,
                                        htmlFn: htmlFn,
                                        //statusFn: updateStatus,
                                        });

    before = "before";
    listing = getListing(before);
    imgFnItems = htmlFnItems = [];
    htmlItem = getChild("youtube");
    imgItem = getChild("image");
  });

  it("makes proper base URL", function() {
    expect(picFetcher._getUrlForSubreddits(["All", "funny"], "", "hot")).toEqual("http://www.reddit.com/r/All+funny/hot/.json?jsonp=?");
  });

  it("makes proper after URL", function() {
    expect(picFetcher._getUrlForSubreddits(["All", "funny"], "afterTag", "hot")).toEqual("http://www.reddit.com/r/All+funny/hot/.json?jsonp=?&after=afterTag");
  });

  it("properly blocks dupe items", function() {
    var types = [ [imgItem, "appendImage"], 
    [htmlItem, "enrichItem"] ];
    for(var ti in types) {
      var item = types[ti][0].data;
      var fn = types[ti][1];
      spyOn( picFetcher, fn);

      expect(picFetcher.haveSeenItem(item)).toBeFalsy();
      picFetcher.handleListing(item);
      expect(picFetcher[fn]).toHaveBeenCalled();
      expect(picFetcher.haveSeenItem(item)).toBeTruthy();
      expect(picFetcher[fn].calls.length).toEqual(1);

      // Now show it again... should be blocked this time.
      picFetcher.handleListing(item);
      expect(picFetcher[fn].calls.length).toEqual(1);
    }
  });
});