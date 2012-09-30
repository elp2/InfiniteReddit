describe("Reddit.PicFetcher", function() {
  var picFetcher;

  beforeEach(function() {
    picFetcher = new reddit.PicFetcher({onlineMode: false, 
/*                                        imgFn: addImg,
                                        htmlFn: addHtml,
                                        statusFn: updateStatus,
                                        show_over_18: localStorage["show_over_18"]==="on",
                                        show_videos: localStorage["show_videos"]==="on" */
                                        });

  });

  it("makes proper base URL", function() {
    expect(picFetcher._getUrlForSubreddits(["All", "funny"], "")).toEqual("http://www.reddit.com/r/All+funny/.json?jsonp=?");
  });

  it("makes proper after URL", function() {
    expect(picFetcher._getUrlForSubreddits(["All", "funny"], "afterTag")).toEqual("http://www.reddit.com/r/All+funny/.json?jsonp=?&after=afterTag");
  });


});