var Elo = require('arpad');

function predict(team1, team2) {
  var elo = new Elo();
  return elo.expectedScore(team1, team2);
}

module.exports = predict;