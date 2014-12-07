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

  results[0] = { winner: 'Titan.CS', loser: 'Denial eSports' };
  results[1] = { winner: 'fnatic', loser: 'eLevate' };
  results[2] = { winner: 'Virtus.Pro.CS', loser: 'iBUYPOWER' };
  results[3] = { winner: 'Cloud9.CS', loser: 'mousesports.CS' };

  // results[4] = predictMatch(standings, results[0].loser, results[1].loser);
  // results[5] = predictMatch(standings, results[2].loser, results[3].loser);

  results[4] = { winner: 'Denial eSports', loser: 'eLevate' };
  results[5] = { winner: 'iBUYPOWER', loser: 'mousesports' };

  // results[6] = predictMatch(standings, results[0].winner, results[1].winner);
  // results[7] = predictMatch(standings, results[2].winner, results[3].winner);

  results[6] = { winner: 'fnatic', loser: 'Titan.CS' };
  results[7] = { winner: 'Virtus.Pro.CS', loser: 'Cloud9.CS'};

  // results[8] = predictMatch(standings, results[4].winner, results[6].loser);
  // results[9] = predictMatch(standings, results[5].winner, results[7].loser);

  results[8] = { winner: 'Denial eSports', loser: 'Cloud9.CS' };
  results[9] = { winner: 'iBUYPOWER', loser: 'Titan.CS' };

  results[10] = predictMatch(standings, results[8].winner, results[9].winner);

  results[11] = predictMatch(standings, results[6].winner, results[7].winner);

  results[12] = predictMatch(standings, results[11].loser, results[10].winner);

  results[13] = predictMatch(standings, results[11].winner, results[12].winner);

  return results;
}

module.exports = predict;