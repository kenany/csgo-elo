var Elo = require('arpad');
var csv = require('csv-parser');
var csvWriter = require('csv-write-stream');
var fs = require('graceful-fs');
var pairs = require('lodash.pairs');
var sortBy = require('lodash.sortby');
var forEachRight = require('lodash.foreachright');

var elo = new Elo();

var teams = {};
var changes = {};
var margins = {};

process.stdin
  .pipe(csv())
  .on('data', function(row) {

    // For some reason, there are two names for Virtus Pro on GosuGamers:
    //   - Virtus.Pro.CS
    //   - Virtus Pro-CS
    //
    // The latter of which only appears in some of the earlier games, so perhaps
    // there was a name change. Regardless, clicking both teams leads to the
    // same page: Virtus.Pro.CS
    if (row.team1 === 'Virtus Pro-CS') {
      row.team1 = 'Virtus.Pro.CS';
    }
    else if (row.team2 === 'Virtus Pro-CS') {
      row.team2 = 'Virtus.Pro.CS';
    }

    // Two names for LunatiK on GosuGamers:
    //
    //   - LunatiK
    //   - LunatiK eSports
    //
    // Go with the former.
    if (row.team1 === 'LunatiK eSports') {
      row.team1 = 'LunatiK';
    }
    else if (row.team2 === 'LunatiK eSports') {
      row.team2 = 'LunatiK';
    }

    // compLexity Gaming is basically Cloud9 now.
    if (row.team1 === 'compLexity Gaming') {
      row.team1 = 'Cloud9.CS';
    }
    else if (row.team2 === 'compLexity Gaming') {
      row.team2 = 'Cloud9.CS';
    }

    // If either of these teams have not been seen yet, create entries for them.
    if (!teams[row.team1]) {
      teams[row.team1] = 1500;
      changes[row.team1] = [];
      margins[row.team1] = 0;
    }
    if (!teams[row.team2]) {
      teams[row.team2] = 1500;
      changes[row.team2] = [];
      margins[row.team2] = 0;
    }

    var team1rating = teams[row.team1];
    var team2rating = teams[row.team2];

    var result1 = parseInt(row.result1, 10);
    var result2 = parseInt(row.result2, 10);

    var winnerRating = team1rating;
    var loserRating = team2rating;
    if (result2 > result1) {
      winnerRating = team2rating;
      loserRating = team1rating;
    }

    // point differential (discounted when favorites win)
    var multi = Math.log(Math.abs(row.score1 - row.score2) + 1)
                * (2.2 / ((winnerRating - loserRating) * 0.001 + 2.2));

    elo.setKFactor(32 * multi);

    // calculate the expected scores of each team
    var team1odds = elo.expectedScore(team1rating, team2rating);
    var team2odds = elo.expectedScore(team2rating, team1rating);

    var team1new;
    var team2new;
    if (result1 > result2) {
      team1new = elo.newRating(team1odds, 1, team1rating);
      team2new = elo.newRating(team2odds, 0, team2rating);
    }
    else {
      team1new = elo.newRating(team1odds, 0, team1rating);
      team2new = elo.newRating(team2odds, 1, team2rating);
    }

    teams[row.team1] = team1new;
    teams[row.team2] = team2new;

    margins[row.team1] += row.score1 - row.score2;
    margins[row.team2] += row.score2 - row.score1;

    changes[row.team1].push([row.date, team1new, margins[row.team1]]);
    changes[row.team2].push([row.date, team2new, margins[row.team2]]);
  })
  .on('end', function() {
    console.log();
    var rankings = sortBy(pairs(teams), function(team) {
      return team[1];
    });

    var writer = csvWriter({
      headers: ['team', 'elo']
    });
    writer.pipe(fs.createWriteStream('standings.csv'));
    forEachRight(rankings, function(team, i) {
      console.log('%d. %s (%d)', rankings.length - i, team[0], team[1]);
      writer.write([team[0], team[1]]);
    });

    writer.end();

    Object.keys(changes).forEach(function(team) {
      writer = csvWriter({
        headers: ['date', 'elo', 'margin']
      });
      writer.pipe(fs.createWriteStream('teams/' + team + '.csv'));
      changes[team].forEach(function(row) {
        writer.write({date: +(new Date(row[0])), elo: row[1], margin: row[2]});
      });
      writer.end();
    });
  });