const { redditScraper } = require("./index");
const scrapedata = async (SubReddit) => {
  try {
    class Memeobj {
      constructor(Sub, page = 4) {
        this.Pages = page;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = Sub;
      }
    }
    const obj = new Memeobj(SubReddit);
    const memeData = await redditScraper.scrapeData(obj);
    const memeUrls = await memeData.map((obj) => ({
      url: obj.data.url,
      title: obj.data.title
    }));
    const imgUrl = memeUrls.filter((name) =>
      name.url.match(/\.(gif|jpeg|jpg|png)$/gi)
    );
    return imgUrl;
  } catch (err) {
    console.log(err);
  }
};
exports.scrapedata = scrapedata;
