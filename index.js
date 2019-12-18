//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const express = require("express");
const app = express();
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 0
});


const redditScraperOptions = {
  AppId: "YZwduUlkpuIkJw",
  AppSecret: "ZcS65djwnC5nT_GmlH4PbPD8SsI"
};
const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
console.log("Configuration Loaded!");

const scrapedata = async SubReddit => {
  try {
    const pages = 4;

    class Memeobj {
      constructor(subreddit) {
        this.Pages = 1;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = subreddit;
        this.Info = null;
        this.urls = [];
      }
    }

    const obj = new Memeobj(SubReddit);
    obj.Info = await redditScraper.scrapeData(obj);
    obj.urls = await obj.Info.map(obj => obj.data.url);
    var imgUrl = obj.urls.filter(name => name.includes('.jpg') || name.includes('.png') || name.includes('.jpeg') || name.includes('.gif'));
    return imgUrl;
  } catch (err) {
    console.log(err);
  }
};

const set = async (req, res, next) => {
  try {
    const sub = req.params.sub;
    const Urls = await scrapedata(sub);
    const urls = JSON.stringify(Urls);
    console.log(Urls);
    console.log(typeof (urls));
    cache.set(sub, urls);
    return res.send(Urls);
    next();
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

const get = (req, res, next) => {
  const sub = req.params.sub;
  const content = cache.get(sub);
  if (content) {
    return res.status(200).send(JSON.parse(content));
  }
  return next();
};

app.get("/:sub", get, set);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`server has started in ${port}`);
});