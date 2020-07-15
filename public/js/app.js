const counties = document.getElementById('counties')
const countiesBarChart = document.getElementById('counties-bar-chart')
const stateChart = document.getElementById('chrono-chart-state')
const status = document.getElementById('status')
const perCapitaState = document.getElementById('per-capita')
counties.textContent = ''

let mississippiCounties = {}

const getAndRenderMsData = () => {
  status.innerHTML = 'loading...'

  try {
    fetch('api/v1/mississippi').then((response) => {
      response.json().then((data) => {
        console.log('data', data)
        return data;
      }).then((data) => {
        mississippiCounties = data;
  
        // get the last item in today's count 
        // to merge with chrono data. i'm getting today's
        // count from ms dept of health and chrono from nytimes,
        // otherwise this wouldn't be necessary if this came from my own db
        let totalCountToday = mississippiCounties.results.pop();
        console.log(mississippiCounties.date)
        totalCountToday.date = mississippiCounties.date;
        
  
        status.innerHTML = `${totalCountToday.cases} total COVID-19 cases in Mississippi`
        perCapitaState.innerHTML = `${totalCountToday.perCapita} per 1000 residents`
        getStateChronoData(totalCountToday);
  
        return mississippiCounties;
      }).then((data) => {
        renderTable(data)
      })
    }).catch(error => {
      console.log(error)
      loading.innerHTML = ''
      counties.innerHTML = ''
      stateChart.innerHTML = data.error;
      counties.innerHTML = data.error;
      console.log(error);
    })

  } catch(error) {
    console.log(error)
    loading.innerHTML = 'An error occured.'
  }
  
}

const renderTable = (data) => {
  counties.innerHTML = ''
    if (data.error) {
      counties.innerHTML = ''
      counties.innerHTML = data.error
    } else {
      counties.innerHTML = ''

      let countyNames = ['Counties'];
      let cases = [];
      let deaths = [];

      let header = data.results.shift();

      createMap(data)

      data.results.forEach((county) => {
        let name = county.county
        countyNames.push(name)

        let caseCount = {
          meta: 'Cases', 
          value: county.cases
        }

        let deathCount = {
          meta: 'Deaths',
          value: county.deaths
        }

        cases.push(caseCount)
        deaths.push(deathCount)
      })

      new Chartist.Bar('#chart2', {
        labels: countyNames,
        series: [
          cases
        ]
      }, {
        seriesBarDistance: 10,
        reverseData: true,
        horizontalBars: true,
        axisY: {
          offset: 70
        },
        width: '100%',
        height: '1000px',
        plugins: [
          Chartist.plugins.tooltip()
        ]
      });

      let table = document.createElement('table');
      counties.appendChild(table)

      generateTableHead(table, header);
      generateTable(table, data.results)
    }
  }

window.onload = async function() {
  getAndRenderMsData();
}

const utcDate = () => {
  const today = new Date();
  
  const utcDay = today.getUTCDate()
  const yyyy = today.getUTCFullYear();
  let dd = utcDay - 1;
  let mm = today.getUTCMonth() + 1;
  
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    date = `${mm}-${dd}-${yyyy}`

    return date;
}

const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();

  const headers = ['county', 'cases', 'deaths', 'cases per 1000', 'population'];

  for (let key of headers) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

const generateTable = (table, data) => {
  for (let element of data) {
    let row = table.insertRow();
    
    let rowValues = {
      county: element.county,
      cases: element.cases,
      deaths: element.deaths,
      perCapita: element.perCapita,
      population: element.population
    }

    for (key in rowValues) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

const formatDate = (date) => {
  let dates = date.split('-');
  let formattedDate = `${dates[1].replace('0', '')}/${dates[2]}`
  return formattedDate;
}

const sparkLine = () => {
  $(function() {
    $(".inlinesparkline").sparkline();
  });
}

const getStateChronoData = (totalCountToday) => { 
  fetch(`/api/v1/chronological/states?state=mississippi`).then((response) => {
    let stateData = [];

    response.json().then((data) => {
      if (data.error) {
        stateData = data.error;
      } else {
        stateData = data.chronological.results;

        stateData.push(totalCountToday)

        let stateDataLength = stateData.length;
        let chartNumberOfDays = 14;
        if (stateDataLength < chartNumberOfDays) {
          chartNumberOfDays = stateDataLength
        }

        const daysOnChart = stateData.slice((stateDataLength - chartNumberOfDays), stateDataLength)

        let dayLabels = daysOnChart.map((day) => {
          let date = formatDate(day.date)
          return date;
        })



        let caseCounts = daysOnChart.map((day) => {
          let caseCount = {
            meta: 'Cases', 
            value: day.cases.replace(',', '')
          }
  
          
          return caseCount;
        })

        let deathCounts = daysOnChart.map((day) => {
          let deathCount = {
            meta: 'Deaths',
            value: day.deaths
          }
          return deathCount;
        })

        new Chartist.Line('#chart1', {
          labels: dayLabels,
          series: [
            caseCounts, deathCounts
          ]
        }, {
          fullWidth: true,
          chartPadding: {
            right: 40
          },
          plugins: [
            Chartist.plugins.tooltip()
          ]
        });
      }
    })
  })
}

const createMap = function(data) {
  // create map
  var map = anychart.map();

  let dataMap = data.results.map((county) => {
    let countyData = {
      id: county.id,
      value: county.cases,
      deaths: county.deaths,
      population: county.population,
      perCapita: county.perCapita
    }
    return countyData;
  })

  // create data set
  var dataSet = anychart.data.set(dataMap);
  series = map.choropleth(dataSet);

  series.tooltip().format(function(e){
    return "Cases: " + e.getData("value") + "\n"+
    "Deaths: " + e.getData("deaths") + "\n" +
    "Population: " + e.getData("population") + "\n" +
    "Cases per capita: " + e.getData("perCapita") +"\n"
  });

  series.geoIdField('id');

  series.colorScale(anychart.scales.linearColor('#fce4bd', '#c77802'));
  series.hovered().fill('#addd8e');

  map.geoData(anychart.maps['mississippi']);
  map.container('container');
  map.draw();
};