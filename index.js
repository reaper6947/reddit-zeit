//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const url = require('url');
const express = require("express");
const app = express();




//cron.schedule('* * /6 * * *', function(){
(async () => {

  const redditScraperOptions = {
    AppId: "YZwduUlkpuIkJw",
    AppSecret: "ZcS65djwnC5nT_GmlH4PbPD8SsI",
  };

  const pgNum = 6 ;
  const sortType = "top" ;

  /*  const meme = {
      Pages: 6,
      Records: 25,
      SubReddit: "meme",
      SortType: "top",
    };
  */

  const memes = {
    Pages: pgNum,
    Records: 25,
    SubReddit: "memes",
    SortType: sortType,
  };

  const dank_Meme = {
    Pages: pgNum,
    Records: 25,
    SubReddit: "dank_meme",
    SortType: sortType,
  };

  const deepFriedMemes = {
    Pages: pgNum,
    Records: 25,
    SubReddit: "deepfriedmemes",
    SortType: sortType,
  };

  const memeEconomy = {
    Pages: pgNum,
    Records: 25,
    SubReddit: "MemeEconomy",
    SortType: sortType,
  };

  try {
    const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
    console.log("Configuration Loaded!");

  /*  var memeData = await redditScraper.scrapeData(meme);
    console.log("Meme Subreddit Scraped!");
  */
    var memesData = await redditScraper.scrapeData(memes);
    console.log("Memes Subreddit Scraped!");
    var dank_MemesData = await redditScraper.scrapeData(dank_Meme);
    console.log("Dank_Memes Subreddit Scraped!");
    var deepFriedMemesData = await redditScraper.scrapeData(deepFriedMemes);
    console.log("DeepFriedMemes Subreddit Scraped!");
    var memeEconomyData = await redditScraper.scrapeData(memeEconomy);
    console.log("MemeEconomy Subreddit Scraped!");

    const scrapedData = [].concat.apply([], [/*memeData,*/ memesData,dank_MemesData,deepFriedMemesData,memeEconomyData ]);
    var memeCount = 0;
    var skipCount = 0;
    var invalidCount = 0;
    var url = [] ;
    for (i = 0; i < scrapedData.length; i++) {
       url.push(scrapedData[i].data.url);
      console.log(url);
    }
    console.log(scrapedData.length + " total memes fetched.");

  } catch (error) {
    console.error(error);
  }
  app.get("/", (req, res) => {
    res.json(
      url
    );
  });
var port = process.env.PORT || 5000;
  app.listen(port, function() {
    console.log("server has started in 5000");
  });

})();
//  });
