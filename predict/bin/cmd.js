#!/usr/bin/env node

var csv = require('csv-parser');
var minimist = require('minimist');
var printf = require('printf');
var table = require('text-table');

var predict = require('../')

var argv = minimist(process.argv.slice(2));

var matches = [];

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    matches.push(row);
  })
  .on('end', function() {
    var infer = predict(argv._[0], argv._[1], matches);
    var t = table([
      ['', argv._[0], argv._[1]],
      ['Elo', printf('%.2f\%', infer.elo * 100), printf('%.2f\%', 100 - infer.elo * 100)],
      ['Glicko', printf('%.2f\%', infer.glicko * 100), printf('%.2f\%', 100 - infer.glicko * 100)],
    ]);
    console.log(t);
  });