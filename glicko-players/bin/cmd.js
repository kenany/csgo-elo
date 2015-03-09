#!/usr/bin/env node

var ndjson = require('ndjson');
var table = require('markdown-table');
var sortBy = require('lodash.sortby');
var glickoPlayers = require('../');

process.stdin.pipe(ndjson.parse())
  .on('data', glickoPlayers)
  .on('end', function() {
    var t = [];
    var players = glickoPlayers.getPlayers();

    Object.keys(players).forEach(function(key) {
      var player = players[key];
      t.push([key, player.getRating(), player.getRd(), +player.getVol().toFixed(4)]);
    });

    t = sortBy(t, function(row) {
      return -row[1];
    });

    t.unshift(['player', 'rating', 'deviation', 'volatility']);

    console.log(table(t));
  });
