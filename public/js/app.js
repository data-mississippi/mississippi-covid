const counties = document.querySelector('#counties')
counties.textContent = ''


const getMSDeptOfHealthData = () => {
  fetch('api/v1/mississippi').then((response) => {
    response.json().then((data) => {
      renderTable(data)
      console.log(data)
      let totalCountToday = data.pop()
      console.log(totalCountToday)
      totalCountToday.date = '2020-03-30'
      getStateChronoData(totalCountToday);
    })
  })
}

const renderTable = (data) => {
  const date = utcDate();

  counties.innerHTML = ''
    if (data.error) {
      counties.innerHTML = ''
      counties.innerHTML = data.error
    } else {
      counties.innerHTML = ''

      // create date context descript and table
      //let date = `Mississippi cases as of ${data.daily.date}`
      let dateHeader = document.createElement('h3')
      dateHeader.id = 'counties-header'
      let text = document.createTextNode(`Mississippi cases as of ${date}`)
      dateHeader.appendChild(text);
      counties.appendChild(dateHeader)

      let table = document.createElement('table');
      counties.appendChild(table)

      let header = Object.keys(data[0])

      generateTableHead(table, header);
      generateTable(table, data)
    }
  }

window.onload = async function() {
  counties.innerHTML = '<p>loading...</p>'

  
  getMSDeptOfHealthData();


  
  
  
  // await fetch(`/api/v1/daily/us/counties?date=${date}&state=mississippi`).then((response) => {
  //   response.json().then((data) => {
  //     counties.innerHTML = ''
  //     if (data.error) {
  //       counties.innerHTML = ''
  //       counties.innerHTML = data.error
  //     } else {
  //       counties.innerHTML = ''

  //       // create date context descript and table
  //       let date = `Mississippi cases as of ${data.daily.date}`
  //       let dateHeader = document.createElement('h3')
  //       dateHeader.id = 'counties-header'
  //       let text = document.createTextNode(date)
  //       dateHeader.appendChild(text);
  //       counties.appendChild(dateHeader)

  //       let table = document.createElement('table');
  //       counties.appendChild(table)

  //       let header = Object.keys(data.daily.results[0])

  //       generateTableHead(table, header);
  //       generateTable(table, data.daily.results)
  //     }
  //   })
  // })
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

let ctx = document.getElementById('chrono-chart-state').getContext('2d');

let stateData = [];
const getStateChronoData = (totalCountToday) => { 
  fetch(`/api/v1/chronological/states?state=mississippi`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        stateData = data.error;
      } else {
        stateData = data.chronological.results;
        
        
        stateData.push(totalCountToday)

        console.log(totalCountToday)
        console.log(stateData)

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

        let chart = new Chart(ctx, {
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
          },
      
          // Configuration options go here
          options: {}
      });
      }
    })
  })
}