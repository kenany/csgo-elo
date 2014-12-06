#!/usr/bin/env node

var csv = require('csv-parser');
var minimist = require('minimist');

var predict = require('../')

var argv = minimist(process.argv.slice(2));

var teams = {};

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    teams[row.team] = row.elo;
  })
  .on('end', function() {
    console.log('%d\%', predict(teams[argv._[0]], teams[argv._[1]]) * 100);
  });