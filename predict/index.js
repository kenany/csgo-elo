var Elo = require('arpad');
var map = require('lodash.map');
var sortBy = require('lodash.sortby');
var binomial = require('choose');
var sum = require('compute-sum');

var eloCalculate = require('@csgo-elo/elo');
var glickoCalculate = require('@csgo-elo/glicko');

function predict(matches, team1, team2, n) {
  var eloRatings = eloCalculate(matches);
  var glickoRatings = glickoCalculate(matches);

  var elo = new Elo();

  var epa = elo.expectedScore(eloRatings[team1], eloRatings[team2]);
  var epb = 1 - epa;
  var gpa = glickoRatings[team1]._E(glickoRatings[team2].__rating, glickoRatings[team2].__rd);
  var gpb = 1 - gpa;

  var outcomes = [];
  var tally = {};
  tally[team1] = [0, 0];
  tally[team2] = [0, 0];

  for (var i = 0; i < n; i++) {
    var base = binomial(n + i - 1, i) * Math.pow(epa, n) * Math.pow(epb, i);
    outcomes.push([base, n, i, team1, team2, n, i]);
    tally[team1][1] += base;
    tally[team2][0] += base;
  }

  for (var i = 0; i < n; i++) {
    var base = binomial(n + i - 1, i) * Math.pow(epb, n) * Math.pow(epa, i);
    outcomes.push([base, i, n, team2, team1, n, i]);
    tally[team2][1] += base;
    tally[team1][0] += base;
  }

  outcomes = sortBy(outcomes, function(o) {
    return o[1] - o[2];
  });

  var probs = map(outcomes, function(o) {
    return o[0];
  });

  function sup(i) {
    return -Math.min(sum(probs.slice(0, i + 1)), sum(probs.slice(i)));
  }

  var ind = 0;
  var objective = sup(0);

  for (var i = 1; i < probs.length; i++) {
    var p = sup(i);
    if (p < objective) {
      objective = p;
      ind = i;
    }
  }

  return {
    'elo': elo.expectedScore(eloRatings[team1], eloRatings[team2]),
    'glicko': glickoRatings[team1]._E(glickoRatings[team2].__rating, glickoRatings[team2].__rd),
    'outcomes': outcomes,
    'tally': tally,
    'median': outcomes[ind]
  };
}

module.exports = predict;
