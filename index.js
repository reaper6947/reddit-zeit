const express = require("express");
const app = express();
const LRU = require("lru-cache");
const cache = new LRU({ max: 500, maxAge: 1000 * 3600 });
const axios = require('axios');
app.use(express.json());

/*
app.use("/url/:sub", (req, res, next) => {
  res.set('Cache-Control', 'public,max-age=21600');
  next();
})
*/
const scrapedata = async (SubReddit) => {
  try {
    //const imgUrl = await axios.get(`https://reddit-zeit.now.sh/url/${SubReddit}`)
    const imgUrl = await axios.get(`https://reddit-zeit-git-url.meme69.now.sh/url/${SubReddit}`).then(resp => { return (resp.data); });
    const imgTitle =await axios.get(`https://reddit-zeit-git-title.meme69.now.sh/url/${SubReddit}`).then(resp => { return (resp.data); });
    return { imgUrl, imgTitle };
  } catch (err) {console.log(err);}
};

const check = (req, res, next) => {
  const {sub} = req.params;
  if (cache.has(sub)) {
    res.json(JSON.parse(cache.get(sub)));
    console.log(`${sub} already in cache`);
  } else {
    next();
  };
};

app.get("/url/:sub", check, async (req, res) => {
  try {
    const {sub} = req.params;
    const content = await scrapedata(sub);
    const strContent = JSON.stringify(content);
    cache.set(sub, strContent);
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