var Elo = require('arpad');
var eloCalculate = require('@csgo-elo/elo');
var glickoCalculate = require('@csgo-elo/glicko');

function predict(team1, team2, matches) {
  var eloRatings = eloCalculate(matches);
  var glickoRatings = glickoCalculate(matches);

  var elo = new Elo();

  return {
    'elo': elo.expectedScore(eloRatings[team1], eloRatings[team2]),
    'glicko': glickoRatings[team1]._E(glickoRatings[team2].__rating, glickoRatings[team2].__rd)
  };
}

module.exports = predict;