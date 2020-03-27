
const counties = document.querySelector('#counties')
counties.textContent = ''

window.onload = function() {
  counties.innerHTML = '<p>loading...</p>'
  fetch('http://localhost:3000/api/v1/daily?state=mississippi').then((response) => {
    response.json().then((data) => {
      counties.innerHTML = ''
      if (data.error) {
        counties.innerHTML = ''
        counties.innerHTML = data.error
      } else {
        let table = document.createElement('table');
        counties.appendChild(table)

        let header = Object.keys(data.daily.results[0])

        generateTableHead(table, header);
        generateTable(table, data.daily.results)
      }
    })
  })
}

const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();

  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

const generateTable = (table, data) => {
  for (let element of data) {
    let row = table.insertRow();

    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}