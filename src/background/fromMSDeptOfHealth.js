const axios = require('axios');
const cheerio = require('cheerio');

const fromMSDeptOfHealth = (query, returnResponse) => {
  const url = 'https://msdh.ms.gov/msdhsite/_static/14,0,420.html';

  const date = new Date();
  let dateArray = date.toLocaleDateString('en-US').split('/');
  let formattedDate = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
  
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

const counties = {
  'Hinds': {population: '241774', id: 'US.MS.049'},
  'Harrison': {population: '202626', id: 'US.MS.047'},
  'Desoto': {population: '176132', id: 'US.MS.033'},
  'Rankin': {population: '151240', id: 'US.MS.121'},
  'Jackson': {population: '142014', id: 'US.MS.059'},
  'Madison': {population: '103498', id: 'US.MS.089'},
  'Lee': {population: '84915', id: 'US.MS.081'},
  'Lauderdale': {population: '77323', id: 'US.MS.075'},
  'Forrest': {population: '75517', id: 'US.MS.035'},
  'Jones': {population: '68454', id: 'US.MS.067'},
  'Lamar': {population: '61223', id: 'US.MS.073'},
  'Lowndes': {population: '59437', id: 'US.MS.087'},
  'PearlRiver': {population: '55149', id: 'US.MS.109'},
  'KepearlRiver': {population: '55149', id: 'US.MS.109'},
  'Lafayette': {population: '53459', id: 'US.MS.071'},
  'Oktibbeha': {population: '49481', id: 'US.MS.105'},
  'Washington': {population: '47086', id: 'US.MS.151'},
  'Warren': {population: '47075', id: 'US.MS.149'},
  'Hancock': {population: '46653', id: 'US.MS.045'},
  'Pike': {population: '39737', id: 'US.MS.113'},
  'Alcorn': {population: '37180', id: 'US.MS.003'},
  'Monroe': {population: '35840', id: 'US.MS.095'},
  'Marshall': {population: '35787', id: 'US.MS.093'},
  'Lincoln': {population: '34432', id: 'US.MS.085'},
  'Panola': {population: '34243', id: 'US.MS.107'},
  'Bolivar': {population: '32592', id: 'US.MS.011'},
  'Adams': {population: '31547', id: 'US.MS.001'},
  'Pontotoc': {population: '31315', id: 'US.MS.115'},
  'Leflore': {population: '29804', id: 'US.MS.083'},
  'Neshoba': {population: '29376', id: 'US.MS.099'},
  'Copiah': {population: '28721', id: 'US.MS.029'},
  'Tate': {population: '28493', id: 'US.MS.137'},
  'Scott': {population: '28415', id: 'US.MS.123'},
  'Union': {population: '28356', id: 'US.MS.145'},
  'Yazoo': {population: '27974', id: 'US.MS.163'},
  'Simpson': {population: '27073', id: 'US.MS.127'},
  'Sunflower': {population: '26532', id: 'US.MS.133'},
  'Prentiss': {population: '25360', id: 'US.MS.117'},
  'Marion': {population: '25202', id: 'US.MS.091'},
  'Coahoma': {population: '23802', id: 'US.MS.027'},
  'George': {population: '23710', id: 'US.MS.039'},
  'Itawamba': {population: '23480', id: 'US.MS.057'},
  'Leake': {population: '22870', id: 'US.MS.079'},
  'Tippah': {population: '21990', id: 'US.MS.139'},
  'Newton': {population: '21524', id: 'US.MS.101'},
  'Grenada': {population: '21278', id: 'US.MS.043'},
  'Wayne': {population: '20422', id: 'US.MS.153'},
  'Clay': {population: '19808', id: 'US.MS.025'},
  'Tishomingo': {population: '19478', id: 'US.MS.141'},
  'Covington': {population: '19091', id: 'US.MS.031'},
  'Attala': {population: '18581', id: 'US.MS.007'},
  'Stone': {population: '18375', id: 'US.MS.131'},
  'Winston': {population: '18358', id: 'US.MS.159'},
  'Holmes': {population: '18075', id: 'US.MS.051'},
  'Chickasaw': {population: '17279', id: 'US.MS.017'},
  'Jasper': {population: '16529', id: 'US.MS.061'},
  'Smith': {population: '16063', id: 'US.MS.129'},
  'Clarke': {population: '15928', id: 'US.MS.023'},
  'Walthall': {population: '14601', id: 'US.MS.147'},
  'Calhoun': {population: '14571', id: 'US.MS.013'},
  'Tallahatchie': {population: '14361', id: 'US.MS.135'},
  'Greene': {population: '13714', id: 'US.MS.041'},
  'Lawrence': {population: '12630', id: 'US.MS.077'},
  'Amite': {population: '12468', id: 'US.MS.005'},
  'Yalobusha': {population: '12421', id: 'US.MS.161'},
  'Perry': {population: '12028', id: 'US.MS.111'},
  'JeffersonDavis': {population: '11495', id: 'US.MS.065'},
  'Noxubee': {population: '10828', id: 'US.MS.103'},
  'Montgomery': {population: '10198', id: 'US.MS.097'},
  'Tunica': {population: '10170', id: 'US.MS.143'},
  'Carroll': {population: '10129', id: 'US.MS.015'},
  'Kemper': {population: '10107', id: 'US.MS.069'},
  'Webster': {population: '9828', id: 'US.MS.155'},
  'Claiborne': {population: '9120', id: 'US.MS.021'},
  'Wilkinson': {population: '8990', id: 'US.MS.157'},
  'Humphreys': {population: '8539', id: 'US.MS.053'},
  'Choctaw': {population: '8321', id: 'US.MS.019'},
  'Benton': {population: '8253', id: 'US.MS.009'},
  'Franklin': {population: '7757', id: 'US.MS.037'},
  'Quitman': {population: '7372', id: 'US.MS.119'},
  'Jefferson': {population: '7346', id: 'US.MS.063'},
  'Sharkey': {population: '4511', id: 'US.MS.125'},
  'Issaquena': {population: '1328', id: 'US.MS.055'},
  'Total': {population: '2987000', id: '0'}
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
    if ((i + 1) % 5 == 0) {
      console.log(tableData)
      let countyMap = {
        county: tableData[i - 2],
        cases: tableData[i - 1].replace(',', ''),
        deaths: tableData[i].length === 0 ? '0' : tableData[i] 
      }

      console.log(countyMap)

      let countyPopulation = counties[countyMap.county.replace(/ /g, "")].population
      let id = counties[countyMap.county.replace(/ /g, "")].id
      let casesPer1000 = calculatePerCapita(countyMap.cases, countyPopulation)

      



      countyMap.id = id;
      countyMap.population = countyPopulation;
      countyMap.perCapita = casesPer1000;
      mississippiCountyCases.push(countyMap);
    }
    
  }



  return mississippiCountyCases;
}

module.exports = fromMSDeptOfHealth;