var Glicko = require('glicko2').Glicko2;
var csv = require('csv-parser');
var pairs = require('lodash.pairs');
var sortBy = require('lodash.sortby');
var forEachRight = require('lodash.foreachright');

var glicko = new Glicko();

var teams = {};

process.stdin
  .pipe(csv())
  .on('data', function(row) {
    row.team1 = row.team1.replace('Virtus Pro-CS', 'Virtus.Pro.CS');
    row.team2 = row.team2.replace('Virtus Pro-CS', 'Virtus.Pro.CS');

    row.team1 = row.team1.replace('LunatiK eSports', 'LunatiK');
    row.team2 = row.team2.replace('LunatiK eSports', 'LunatiK');

    row.team1 = row.team1.replace('compLexity Gaming', 'Cloud9.CS');
    row.team2 = row.team2.replace('compLexity Gaming', 'Cloud9.CS');

    if (!teams[row.team1]) {
      teams[row.team1] = glicko.makePlayer();
    }
    if (!teams[row.team2]) {
      teams[row.team2] = glicko.makePlayer();
    }

    var result1 = parseInt(row.result1, 10);
    var result2 = parseInt(row.result2, 10);

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
  });