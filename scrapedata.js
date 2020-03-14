const {redditScraper} = require("./index");
const scrapedata = async (SubReddit,page=4) => {
    try {
        class Memeobj {
            constructor(Sub) {
                this.Pages = page;
                this.Records = 25;
                this.SortType = "top";
                this.SubReddit = Sub;
                /* this.Info = null; */
                /* this.urls = []; */
            }
        };
        const obj = new Memeobj(SubReddit);
      const memeData = await redditScraper.scrapeData(obj);
      const memeDat = await memeData.filter(name => name.data.post_hint.includes("image"));
      const memeUrl = await memeDat.map(obj => obj.data.url);
     //   const imgUrl = memeUrls.filter(name => name.match(/\.(gif|jpeg|jpg|png)$/ig));
        return memeUrl;
    } catch (err) {
        console.log(err);
    }
};
exports.scrapedata = scrapedata;
