const {redditScraper} = require("./index");

const scrapedata = async (SubReddit) => {
    try {
        class Memeobj {
            constructor(Sub) {
                this.Pages = 4;
                this.Records = 25;
                this.SortType = "top";
                this.SubReddit = Sub;
              
            }
        };
        const obj = new Memeobj(SubReddit);
        const memeData = await redditScraper.scrapeData(obj);
        const memeUrls = await memeData.map(obj => obj.data.url);
        const imgUrl = memeUrls.filter(name => name.match(/\.(gif|jpeg|jpg|png)$/ig));
        return imgUrl;
    } catch (err) {
        console.log('error in scrape');
    }
};

exports.scrapedata = scrapedata;