const createDateForQuery = () => {
  const today = new Date();
  const utc = today.getTime()
  const yyyy = today.getFullYear();
  let dd = today.getDate() - 1;
  let mm = today.getMonth() + 1;
  
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    date = `${mm}-${dd}-${yyyy}`

    return date;
}

module.exports = createDateForQuery;