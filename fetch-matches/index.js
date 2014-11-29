var csvWriter = require('csv-write-stream');
var eachAsync = require('each-series');
var getMatches = require('gosugamers-matches');
var through = require('through');
var inherits = require('inherits');
var isNaN = require('lodash.isnan');

function FetchMatchesStream(pages) {
  if (!(this instanceof FetchMatchesStream)) {
    return new FetchMatchesStream(pages);
  }

  var rs = through();

  var writer = csvWriter();
  writer.pipe(rs);

  var allMatches = [];

  eachAsync(pages, function(page, _, done) {
    getMatches(page, function(error, matches) {
      if (error) {
        done(error);
        return;
      }

      allMatches = allMatches.concat(matches);

      done();
    });
  }, function(error) {
    if (error) {
      throw error;
    }

    // sort ascending
    allMatches.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });

    allMatches.forEach(function(match) {
      var ret = {
        date: (new Date(match.date * 1000)).toISOString(),
        team1: match.opponent1,
        team2: match.opponent2,
        result1: match.score1,
        result2: match.score2,
        score1: 0,
        score2: 0
      };

      for (var i = 1; i < 6; i++) {
        if (match['round' + i] && !isNaN(match['round' + i].home)) {
          ret.score1 += match['round' + i].home;
          ret.score2 += match['round' + i].away;
        }
      }

      writer.write(ret);
    });

    writer.end();
  });

  return rs;
}

module.exports = FetchMatchesStream;