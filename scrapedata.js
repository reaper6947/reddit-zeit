const { redditScraper } = require("./index");

const scrapedata = async (SubReddit, page = 4) => {
  try {
    class Memeobj {
      constructor(Sub) {
        this.Pages = page;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = Sub;
        /* this.Info = null; */
        /* this.urls = []; */
        this.image = (object) => {
          return object.filter((item) => item.data.post_hint.includes("image"));
        };
        this.data = (object) => {
          return object.map((obj) => ({
            url: obj.data.url,
            title: obj.data.title
          }));
        };
      }
    }
    const obj = new Memeobj(SubReddit);
    const memeData = await redditScraper.scrapeData(obj);
    const memeImgs = await obj.image(memeData);
    const memeDat = await obj.data(memeImgs);
    //const memeImages = await memeData.filter(item => item.data.post_hint.includes("image"));
    // const memeUrls = await obj.url(memeImgs);
    // const memeTitle = await obj.title(memeImgs);
    // const memeUrls = await memeImages.map(obj => obj.data.url);
    // const imgUrl = memeUrls.filter(name => name.match(/\.(gif|jpeg|jpg|png)$/ig));
    return memeDat;
  } catch (err) {
    console.log(err);
  }
};

exports.scrapedata = scrapedata;
