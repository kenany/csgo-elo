var Glicko = require('glicko2').Glicko2;
var csv = require('csv-parser');
var pairs = require('lodash.pairs');
var sortBy = require('lodash.sortby');
var forEachRight = require('lodash.foreachright');

var ALIASES = {
  'Virtus Pro-CS': 'Virtus.Pro',
  'Virtus.Pro.CS': 'Virtus.Pro',
  'LunatiK eSports': 'LunatiK',
  'compLexity Gaming': 'Cloud9',
  'Cloud9.CS': 'Cloud9',
  'Team Dignitas.CS': 'Team Dignitas'
};

var glicko = new Glicko();

var teams = {};
var matches = [];
var correct = 0;

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    if (ALIASES[row.team1]) {
      row.team1 = ALIASES[row.team1];
    }

    if (ALIASES[row.team2]) {
      row.team2 = ALIASES[row.team2];
    }

    if (!teams[row.team1]) {
      teams[row.team1] = glicko.makePlayer();
    }
    if (!teams[row.team2]) {
      teams[row.team2] = glicko.makePlayer();
    }

    var result1 = parseInt(row.result1, 10);
    var result2 = parseInt(row.result2, 10);

    var odds1 = teams[row.team1]._E(teams[row.team2].getRating(), teams[row.team2].getRd());
    var odds2 = teams[row.team2]._E(teams[row.team1].getRating(), teams[row.team1].getRd());

    if (result1 > result2 && odds1 > odds2) {
      correct++;
    }
    if (result2 > result1 && odds2 > odds1) {
      correct++;
    }

    matches.push([teams[row.team1], teams[row.team2], +(result1 > result2)]);

    glicko.updateRatings([[teams[row.team1], teams[row.team2], +(result1 > result2)]]);
  })
  .on('end', function() {
    console.log();

    var rankings = sortBy(pairs(teams), function(team) {
      return team[1].getRating();
    });

    forEachRight(rankings, function(team, i) {
      console.log('%d. %s (%d)', rankings.length - i, team[0], team[1].getRating());
    });

    console.log(100 * correct / matches.length);
  });