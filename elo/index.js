var Elo = require('arpad');
var forEach = require('lodash.foreach');

var ALIASES = {
  'Virtus Pro-CS': 'Virtus.Pro',
  'Virtus.Pro.CS': 'Virtus.Pro',
  'LunatiK eSports': 'LunatiK',
  'Cloud9.CS': 'Cloud9',
  'Team Dignitas.CS': 'Team Dignitas'
};

function calculate(matches) {
  var elo = new Elo();
  var teams = {};

  forEach(matches, function(match) {
    if (ALIASES[match.team1]) {
      match.team1 = ALIASES[match.team1];
    }

    if (ALIASES[match.team2]) {
      match.team2 = ALIASES[match.team2];
    }

    if (!teams[match.team1]) {
      teams[match.team1] = 1500;
    }
    if (!teams[match.team2]) {
      teams[match.team2] = 1500;
    }

    var ra = teams[match.team1];
    var rb = teams[match.team2];

    var rea = parseInt(match.result1, 10);
    var reb = parseInt(match.result2, 10);

    var wr = ra;
    var lr = rb;
    if (reb > rea) {
      wr = rb;
      lr = ra;
    }

    // calculate the expected scores of each team
    var pa = elo.expectedScore(ra, rb);
    var pb = 1 - pa;

    var an;
    var bn;
    if (rea > reb) {
      an = elo.newRating(pa, 1, ra);
      bn = elo.newRating(pb, 0, rb);
    }
    else {
      an = elo.newRating(pa, 0, ra);
      bn = elo.newRating(pb, 1, rb);
    }

    teams[match.team1] = an;
    teams[match.team2] = bn;
  });

  return teams;
}

module.exports = calculate;