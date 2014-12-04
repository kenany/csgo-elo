var Elo = require('arpad');
var random = require('alea-random');

var games = [
  ['Titan.CS', 'Denial eSports'],
  ['fnatic', 'eLevate'],
  ['Virtus.Pro.CS', 'iBUYPOWER'],
  ['mousesports.CS', 'Cloud9.CS']
];

var elo = new Elo();

function predictMatch(standings, home, away) {
  var odds = elo.expectedScore(standings[home], standings[away]);

  return random(true) > odds
    ? { winner: away, loser: home }
    : { winner: home, loser: away };
}

function predict(standings) {
  var results = [];

  games.forEach(function(match) {
    var res = predictMatch(standings, match[0], match[1]);
    results.push(res);
  });

  results[4] = predictMatch(standings, results[1].loser, results[2].loser);
  results[5] = predictMatch(standings, results[0].loser, results[3].loser);

  results[6] = predictMatch(standings, results[1].winner, results[2].winner);
  results[7] = predictMatch(standings, results[0].winner, results[3].winner);

  results[8] = predictMatch(standings, results[4].winner, results[6].loser);
  results[9] = predictMatch(standings, results[5].winner, results[7].loser);

  results[10] = predictMatch(standings, results[8].winner, results[9].winner);

  results[11] = predictMatch(standings, results[6].winner, results[7].winner);

  results[12] = predictMatch(standings, results[11].loser, results[10].winner);

  results[13] = predictMatch(standings, results[11].winner, results[12].winner);

  return results;
}

module.exports = predict;