let Parser = require('rss-parser');
let parser = new Parser();

const getMSTodayRSS = async (sendData) => {
  
  try {
    let feed = await parser.parseURL('https://mississippitoday.org/category/coronavirus-in-mississippi/feed/');
    sendData(feed)
  } catch(error) {
    console.log(error)
    sendData(error)
  }
}

module.exports = getMSTodayRSS;