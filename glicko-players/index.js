var glicko = require('glicko2');

var g = new glicko.Glicko2({vol: 0.06});
var players = {};

function glickoPlayers(match) {
  var places = [[], []];

  match.home.roster.forEach(function(player) {
    if (!players[player]) {
      players[player] = g.makePlayer();
      players[player].team = match.home.name;
    }

    if (match.score1 > match.score2) {
      places[0].push(players[player]);
    }
    else {
      places[1].push(players[player]);
    }
  });

  match.away.roster.forEach(function(player) {
    if (!players[player]) {
      players[player] = g.makePlayer();
      players[player].team = match.away.name;
    }

    if (match.score2 > match.score1) {
      places[0].push(players[player]);
    }
    else {
      places[1].push(players[player]);
    }
  });

  var race = g.makeRace(places);
  g.updateRatings(race.getMatches());
}

function getPlayers() {
  return players;
}

module.exports = glickoPlayers;
module.exports.getPlayers = getPlayers;
