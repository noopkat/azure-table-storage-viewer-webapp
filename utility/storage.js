// convert fake dates
function getTime(time) {
  return (new Date(time.toString())).getTime();
}

// sort by date descending
function byTime(a, b) {
  const later = getTime(a.Timestamp) > getTime(b.Timestamp);

  switch (later) {
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

function byField(field) {
  return function(a, b) {
    const numeric = typeof a[field] === 'number' && typeof b[field] === 'number';
    const aStr = a[field].toString();
    const bStr = b[field].toString();

    return aStr.localeCompare(bStr, 'kn', {numeric: numeric});
  }
};

module.exports.getLastNRows = function(azure, tableService, columns, n, sort, callback) {
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
    
    const sortStrategy = (sort === 'Timestamp') ? byTime : byField(sort);
    const sorted = rows.slice().sort(sortStrategy);

    return callback(null, sorted);
  });
};
