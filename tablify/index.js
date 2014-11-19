var csv = require('csv-parser');

var rank = 1;
table = 'Position | Team | Rating\n' +
        '--- | --- | ---\n';

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    table += rank + ' | ' + row.team + ' | **' + row.elo + '**\n';
    rank++;
  })
  .on('end', function() {
    console.log(table);
  });