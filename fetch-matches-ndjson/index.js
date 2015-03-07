var eachAsync = require('each-series');
var getMatches = require('gosugamers-matches');
var ndjson = require('ndjson');

function FetchMatchesStream(pages) {
  if (!(this instanceof FetchMatchesStream)) {
    //return new FetchMatchesStream(pages);
  }

  var serialize = ndjson.serialize();

  var allMatches = [];

  eachAsync(pages, function(page, _, done) {
    getMatches(page, 'counterstrike', function(error, matches) {
      if (error) {
        done(error);
        return;
      }

      allMatches = allMatches.concat(matches);

      done();
    });
  }, function(error) {
    if (error) {
      callback(error);
      return;
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
