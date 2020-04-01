const axios = require('axios');
const cheerio = require('cheerio');

const fromMSDeptOfHealth = (query, returnResponse) => {
  const url = 'https://msdh.ms.gov/msdhsite/_static/14,0,420.html';

  const date = new Date();
  let dateArray = date.toLocaleDateString('en-US').split('/');
  let formattedDate = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
  console.log(formattedDate)
  axios.get(url).then((response) => {
    let msCountyCases = parseDOM(response.data);
    const mississippi = {
      source: 'Mississippi State Department of Health',
      sourceURL: url,
      date: formattedDate,
      results: msCountyCases 
    }
    returnResponse(undefined, mississippi);
  }).catch(error => {
    console.log(error);
  })
}

const countyPopulations = {
  'Hinds': '241774',
  'Harrison': '202626',
  'Desoto': '176132',
  'Rankin': '151240',
  'Jackson': '142014',
  'Madison': '103498',
  'Lee': '84915',
  'Lauderdale': '77323',
  'Forrest': '75517',
  'Jones': '68454',
  'Lamar': '61223',
  'Lowndes': '59437',
  'PearlRiver': '55149',
  'Lafayette': '53459',
  'Oktibbeha': '49481',
  'Washington': '47086',
  'Warren': '47075',
  'Hancock': '46653',
  'Pike': '39737',
  'Alcorn': '37180',
  'Monroe': '35840',
  'Marshall': '35787',
  'Lincoln': '34432',
  'Panola': '34243',
  'Bolivar': '32592',
  'Adams': '31547',
  'Pontotoc': '31315',
  'Leflore': '29804',
  'Neshoba': '29376',
  'Copiah': '28721',
  'Tate': '28493',
  'Scott': '28415',
  'Union': '28356',
  'Yazoo': '27974',
  'Simpson': '27073',
  'Sunflower': '26532',
  'Prentiss': '25360',
  'Marion': '25202',
  'Coahoma': '23802',
  'George': '23710',
  'Itawamba': '23480',
  'Leake': '22870',
  'Tippah': '21990',
  'Newton': '21524',
  'Grenada': '21278',
  'Wayne': '20422',
  'Clay': '19808',
  'Tishomingo': '19478',
  'Covington': '19091',
  'Attala': '18581',
  'Stone': '18375',
  'Winston': '18358',
  'Holmes': '18075',
  'Chickasaw': '17279',
  'Jasper': '16529',
  'Smith': '16063',
  'Clarke': '15928',
  'Walthall': '14601',
  'Calhoun': '14571',
  'Tallahatchie': '14361',
  'Greene': '13714',
  'Lawrence': '12630',
  'Amite': '12468',
  'Yalobusha': '12421',
  'Perry': '12028',
  'JeffersonDavis': '11495',
  'Noxubee': '10828',
  'Montgomery': '10198',
  'Tunica': '10170',
  'Carroll': '10129',
  'Kemper': '10107',
  'Webster': '9828',
  'Claiborne': '9120',
  'Wilkinson': '8990',
  'Humphreys': '8539',
  'Choctaw': '8321',
  'Benton': '8253',
  'Franklin': '7757',
  'Quitman': '7372',
  'Jefferson': '7346',
  'Sharkey': '4511',
  'Issaquena': '1328'
}

const calculatePerCapita = (cases, population) => {
  casesPerCapita = (parseInt(cases) / parseInt(population)) * 1000;
  return casesPerCapita.toFixed(2);
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

      let countyPopulation = countyPopulations[countyMap.county.replace(/ /g, "")]
      console.log(countyMap.county)
      console.log(countyPopulation)
      let casesPer1000 = calculatePerCapita(countyMap.cases, countyPopulation)
      console.log(casesPer1000);

      countyMap.population = countyPopulation;
      countyMap.perCapita = casesPer1000;

      mississippiCountyCases.push(countyMap);
    }
    
  }



  return mississippiCountyCases;
}

module.exports = fromMSDeptOfHealth;