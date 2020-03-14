const dotenv = require('dotenv').config({path: __dirname + '/.env'})
const express = require("express");
const app = express();
/*
const LRU = require("lru-cache");
const cache = new LRU({ maxAge: 1000*3600 ,max:800});
*/
const RedditScraper = require("reddit-scraper");
const redditScraperOptions = {AppId: process.env.api_id,AppSecret: process.env.api_key};
const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
exports.redditScraper = redditScraper;
console.log("Configuration Loaded!");
const {scrapedata} = require("./scrapedata");
app.use(express.json());

/*
app.use("/url/:sub", (req, res, next) => {
  res.set('Cache-Control', 'public,max-age=21600');
  next();
})
*/
/*
const check = (req, res, next) => {
  const {sub} = req.params;
  if (cache.has(sub)) {
    res.json(cache.get(sub));
    console.log(`showing ${sub} from cache`);
  } else {
    next();
  };
};
*/
app.get("/url/:sub/" /*,check*/  , async (req, res) => {
  try {
    const { sub } = req.params;
    const content = await scrapedata(sub);
   /*const strContent = JSON.stringify(content);*/
    console.log(`showing  images from  ${sub}`);
    return res.json(content);
  } catch (err) {
    console.log(err); 
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