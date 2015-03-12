var eachAsync = require('each-series');
var getMatches = require('gosugamers-matches');
var ndjson = require('ndjson');
var debug = require('debug')('csgo-elo:fetch-matches-ndjson');

function FetchMatchesStream(pages) {
  var serialize = ndjson.serialize();

  var allMatches = [];

  eachAsync(pages, function(page, _, done) {
    getMatches(page, 'counterstrike', function(error, matches) {
      if (error) {
        done(error);
        return;
      }

      debug(page);
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
      serialize.write(match);
    });

    serialize.end();
  });

  return serialize;
}

module.exports = FetchMatchesStream;
