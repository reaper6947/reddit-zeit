//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const express = require("express");
const app = express();
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 40000
});
app.use((req, res, next) => {
  res.set('Cache-Control', 'public,max-age=31600');
  next()
})

const redditScraperOptions = {
  AppId: "atU4rU0qYTpyjA",
  AppSecret: "G6mDHqkYPR4CUiwSjyJJzVJXv6s"
};
const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
console.log("Configuration Loaded!");



app.use(express.json());


const scrapedata = async (SubReddit) => {
  try {
    class Memeobj {
      constructor(sub) {
        this.Pages = 1;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = sub;
      }
    }
    const obj = new Memeobj(SubReddit);
    const postData = await redditScraper.scrapeData(obj);
    const postUrls = await postData.map(obj => obj.data.url);
    const imgUrl = await postUrls.filter(name => name.includes('.jpg') || name.includes('.png') || name.includes('.jpeg') || name.includes('.gif'));
    return imgUrl;
  } catch (err) {
    console.log(err);
  }
};


const get = (req, res, next) => {
  const sub = req.params.sub;
  if (cache.has(sub)) {
    const content = JSON.parse(cache.get(sub));
    return res.status(200).send(content);
  } else {
    return next();
  };
};

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

app.get("/:sub", get, set);

app.get("/", (req, res) => {
  res.send('type subredit after /');
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`server has started in ${port}`);
});