// sort by date descending
function byTime(a, b) {
  const earlier = getTime(a.Timestamp) > getTime(b.Timestamp);

  switch (earlier) {
    case true:
      return -1;
      break;

    case false:
      return 1;
      break;

    default:
      return 0;
  }
}

// convert fake dates
function getTime(time) {
  return (new Date(time.toString())).getTime();
}

module.exports.getLastNRows = function(azure, tableService, columns, n, callback) {
  const query = new azure.TableQuery()
    .select(columns)
    .top(n);

  tableService.queryEntities(process.env.TABLE_NAME, query, null, function(error, result, response) {
    if (error) return callback(error);

    // each prop in the results comes back with a nested prop of `_`, 
    // so this flattens the props and filters out metadata prop also
    const rows = result.entries.map(e => {
      return Object.keys(e)
        .filter(k => k !== '.metadata')
        .reduce((a, b) => {
          const flatProp = { [b]: e[b]._ };
          return Object.assign(a, flatProp);
        }, {});
    });
    
    const sorted = rows.slice().sort(byTime);

    return callback(null, sorted);
  });
};
