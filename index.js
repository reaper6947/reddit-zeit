const RedditScraper = require("reddit-scraper");
const express = require("express");
const app = express();
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 7200
});
app.use("/url/:sub", (req, res, next) => {
  res.set('Cache-Control', 'public,max-age=21600');
  next();
})
app.use(express.json());
const redditScraperOptions = {
  AppId: "atU4rU0qYTpyjA",
  AppSecret: "G6mDHqkYPR4CUiwSjyJJzVJXv6s"
};
const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
console.log("Configuration Loaded!");
const scrapedata = async (SubReddit) => {
  try {
    class Memeobj {
      constructor(Sub) {
        this.Pages = 4;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = Sub;
        /* this.Info = null; */
        /* this.urls = []; */
      }
    };
    const obj = new Memeobj(SubReddit);
    const memeData = await redditScraper.scrapeData(obj);
    const memeUrls = await memeData.map(obj => obj.data.url);
    const imgUrl = memeUrls.filter(name => name.includes('.jpg') || name.includes('.png') || name.includes('.jpeg') || name.includes('.gif'));
    return imgUrl;
  } catch (err) {
    console.log('error in scrape');
  }
};
const check = (req, res, next) => {
  const {
    sub
  } = req.params;
  if (cache.has(sub)) {
    res.json(JSON.parse(cache.get(sub)));
    console.log(`${sub} has been cached`);
  } else {
    next();
  };
};
/*
const set = async (req, res, next) => {
  const sub = req.params.sub;
  if (cache.has(sub)) {
    const content = JSON.parse(cache.get(sub));
    return res.status(200).send(content);
  };
  try {
    const Urls = await scrapedata(sub);
    const urls = JSON.stringify(Urls);
    console.log(Urls);
    cache.set(sub, urls);
    return res.send(Urls);
    next();
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
*/
app.get("/url/:sub", check, async (req, res) => {
  try {
    const {
      sub
    } = req.params;
    const content = await scrapedata(sub);
    const strContent = JSON.stringify(content);
    cache.set(sub, strContent);
    return res.json(content);
  } catch (err) {
    console.log('error in get');
    return res.status(500);
  }
});
app.get("/", (req, res) => {
  res.send('type subredit after /');
});
app.get("/uptime", (req, res) => {
  function format(seconds) {
    function pad(s) {
      return (s < 10 ? '0' : '') + s;
    };
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  };
  var uptime = process.uptime();
  res.send(`${format(uptime)}`);
});
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`server has started in ${port}`);
});
