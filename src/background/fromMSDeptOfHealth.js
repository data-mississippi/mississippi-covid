const axios = require('axios');
const cheerio = require('cheerio');

const fromMSDeptOfHealth = (query, returnResponse) => {
  const url = 'https://msdh.ms.gov/msdhsite/_static/14,0,420.html';

  axios.get(url).then((response) => {
    let msCountyCases = parseDOM(response.data);
    returnResponse(undefined, msCountyCases);
  }).catch(error => {
    console.log(error);
  })
}

const parseDOM = (html) => {
  tableData = [];
  mississippiCountyCases = [];

  const $ = cheerio.load(html);
  $('table#msdhTotalCovid-19Cases tr td').each((i, elem) => {
    tableData.push($(elem).text())
  })

  let keys = tableData.splice(0, 3);
  
  for (i = 0; i < tableData.length + 1; i++) {
    if ((i + 1) % 3 == 0) {
      let countyMap = {
        county: tableData[i - 2],
        cases: tableData[i - 1],
        deaths: tableData[i].length === 0 ? '0' : tableData[i] 
      }
      mississippiCountyCases.push(countyMap);
    }
    
  }

  return mississippiCountyCases;
}

module.exports = fromMSDeptOfHealth;