const express = require("express");
const app = express();
const RedditScraper = require("reddit-scraper");
const redditScraperOptions = {AppId: "atU4rU0qYTpyjA",AppSecret: "G6mDHqkYPR4CUiwSjyJJzVJXv6s"};
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
app.get("/url/:sub", async (req, res) => {
  try {
    const {sub} = req.params;
    const content = await scrapedata(sub);
    console.log(`caching ${sub}`);
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
