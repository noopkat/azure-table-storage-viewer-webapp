module.exports.byTime = function(a, b) {
  const earlier = (new Date(a.EventEnqueuedUtcTime.toString())).getTime() > (new Date(b.EventEnqueuedUtcTime.toString())).getTime();  
  if (earlier) {
    return -1;
  }
  if (!earlier) {
    return 1;
  }
  return 0;
}

function getLastNRows(azure, tableService, n, callback) {
  const query = new azure.TableQuery()
  .select(['Timestamp', 'EventEnqueuedUtcTime', 'sensor', 'data', 'precipProbability', 'precipIntensity'])
  .top(n)

  tableService.queryEntities(process.env.TABLE_NAME, query, null, function(error, result, response) {
    console.log(error);
    if (error) return callback(error, []);

      const rows = result.entries.map(e => {
        return Object.keys(e).reduce((a, b) => {
          a[b] = e[b]._;
          return a;
        }, {});
      })
      
      rows.sort(byTime);

      return callback(null, rows);
  });
}