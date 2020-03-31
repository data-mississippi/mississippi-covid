const counties = document.getElementById('counties')
const countiesBarChart = document.getElementById('counties-bar-chart')
const stateChart = document.getElementById('chrono-chart-state')
const loading = document.getElementsByClassName('loading')
counties.textContent = ''

let mississippiCounties = {}


const getAndRenderMsData = () => {
  loading.innerHTML = 'loading...'

  fetch('api/v1/mississippi').then((response) => {
    response.json().then((data) => {
      return data;
    }).then((data) => {
      mississippiCounties = data;

      // get the last item in today's count 
      // to merge with chrono data. i'm getting today's
      // count from ms dept of health and chrono from nytimes,
      // otherwise this wouldn't be necessary if this came from my own db
      let totalCountToday = mississippiCounties.results.pop();
      totalCountToday.date = mississippiCounties.date;
      getStateChronoData(totalCountToday);

      return mississippiCounties;
    }).then((data) => {
      renderTable(data)
    })
  }).catch(error => {
    loading.innerHTML = ''
    counties.innerHTML = ''
    stateChart.innerHTML = data.error;
    counties.innerHTML = data.error;
    console.log(error);
  })
}

const renderTable = (data) => {
  counties.innerHTML = ''
    if (data.error) {
      counties.innerHTML = ''
      counties.innerHTML = data.error
    } else {
      counties.innerHTML = ''

      // let ctx = countiesBarChart.getContext('2d');
      // let myBarChart = new Chart(ctx, {
      //   type: 'horizontalBar',
      //   data: {
      //     labels: ['Lee', 'Alcorn'],
      //     datasets: [
      //       {
      //           label: "Test",
      //           data: [100, 75],
      //           backgroundColor: ["#669911", "#119966" ],
      //           hoverBackgroundColor: ["#66A2EB", "#FCCE56"]
      //       }]
      //   },
      // });

      let dateHeader = document.createElement('h3')
      dateHeader.id = 'counties-header'
      let text = document.createTextNode(`Mississippi cases as of ${data.date}`)
      dateHeader.appendChild(text);
      counties.appendChild(dateHeader)

      let table = document.createElement('table');
      counties.appendChild(table)

      let header = Object.keys(data.results[0])

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

  const headers = ['county', 'cases', 'deaths'];

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
      deaths: element.deaths
    }

    for (key in rowValues) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
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
        let chartNumberOfDays = 30;
        if (stateDataLength < chartNumberOfDays) {
          chartNumberOfDays = stateDataLength
        }

        const daysOnChart = stateData.slice((stateDataLength - chartNumberOfDays), stateDataLength)

        let dayLabels = daysOnChart.map((day) => {
          return day.date;
        })

        let caseCounts = daysOnChart.map((day) => {
          return day.cases;
        })

        let deathCounts = daysOnChart.map((day) => {
          return day.deaths;
        })

        let ctx = stateChart.getContext('2d');
        let lineChart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'line',
      
          // The data for our dataset
          data: {
              labels: dayLabels,
              datasets: [{
                  label: 'Confirmed Cases',
                  backgroundColor: 'rgb(227, 83, 73)',
                  borderColor: 'rgb(227, 83, 73)',
                  data: caseCounts
              }, {
                label: 'Confirmed Deaths',
                backgroundColor: 'rgb(235, 177, 52)',
                borderColor: 'rgb(235, 177, 52)',
                data: deathCounts
              }
            ]
          }
        });
      }
    })
  })
}