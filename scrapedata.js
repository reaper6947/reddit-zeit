const { redditScraper } = require("./index");

const scrapedata = async (SubReddit) => {
  try {
    class Memeobj {
      constructor(Sub) {
        this.Pages = 1;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = Sub;
        /* this.Info = null; */
        /* this.urls = []; */
        this.image = (object) => {
          return object.filter((item) => item.data.post_hint.includes("image"));
        };
        this.data = (object) => {
          return object.map((obj) => obj.data);
        };
        this.url = (object) => {
          return object.map((obj) => obj.url);
        };
        this.title = (object) => {
          return object.map((obj) => obj.title);
        };
      }
    }
    const obj = new Memeobj(SubReddit);
    const memeData = await redditScraper.scrapeData(obj);
    //const memeImages = await memeData.filter(item => item.data.post_hint.includes("image"));
    const memeImgs = await obj.image(memeData);
    const memeDat = await obj.data(memeImgs);
    const memeUrls = await obj.url(memeImgs);
    const memeTitle = await obj.title(memeImgs);
    //  const memeUrls = await memeImages.map(obj => obj.data.url);
    //    const imgUrl = memeUrls.filter(name => name.match(/\.(gif|jpeg|jpg|png)$/ig));
    console.log(typeof memeDat);
    return { memeTitle, memeUrls, memeDat };
  } catch (err) {
    console.log(err);
  }
};

exports.scrapedata = scrapedata;
