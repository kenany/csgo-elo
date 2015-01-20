var forEach = require('lodash.foreach');
var Glicko = require('glicko2').Glicko2;

var ALIASES = require('@csgo-elo/aliases');

function calculate(matches) {
  var glicko = new Glicko();
  var teams = {};
  var glickoMatches = [];

  forEach(matches, function(match) {
    if (ALIASES[match.team1]) {
      match.team1 = ALIASES[match.team1];
    }

    if (ALIASES[match.team2]) {
      match.team2 = ALIASES[match.team2];
    }

    if (!teams[match.team1]) {
      teams[match.team1] = glicko.makePlayer();
    }
    if (!teams[match.team2]) {
      teams[match.team2] = glicko.makePlayer();
    }

    var result1 = parseInt(match.result1, 10);
    var result2 = parseInt(match.result2, 10);

    glickoMatches.push([teams[match.team1], teams[match.team2], +(result1 > result2)]);
  });

  glicko.updateRatings(glickoMatches);

  return teams;
}

module.exports = calculate;