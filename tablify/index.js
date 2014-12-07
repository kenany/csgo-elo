#!/usr/bin/env node

var csv = require('csv-parser');

var rank = 1;

console.log('Position | Team | Rating');
console.log('--- | --- | ---');

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    console.log(rank + ' | ' + row.team + ' | **' + row.elo + '**');
    rank++;
  });