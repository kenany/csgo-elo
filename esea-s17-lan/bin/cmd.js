#!/usr/bin/env node

var csv = require('csv-parser');

var predict = require('../');

var standings = {};

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    standings[row.team] = row.elo;
  })
  .on('end', function() {
    var results = {};

    for (var i = 0; i < 1e5; i++) {
      var sim = predict(standings);

      sim.forEach(function(result, j) {
        if (!results[j]) {
          results[j] = {};
        }

        if (!results[j][result.winner]) {
          results[j][result.winner] = 0;
        }

        results[j][result.winner]++;
      });
    }

    console.log(results);
  });