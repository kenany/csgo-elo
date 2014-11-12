var hyperquest = require('hyperquest');
var cheerio = require('cheerio');
var concat = require('concat-stream');
var moment = require('moment');

function parseMatchPage(url, callback) {
  var ret = {};

  var stream = hyperquest(url);

  stream.on('error', callback);

  stream.pipe(concat(function(data) {
    var $ = cheerio.load(data);

    ret.opponent1 = $('.opponent1 a').text();
    ret.opponent2 = $('.opponent2 a').text();

    ret.score1 = parseInt($('.vs .hidden').children().first().text(), 10);
    ret.score2 = parseInt($('.vs .hidden').children().last().text(), 10);

    ret.date = moment($('.datetime').text() + ' +0100', 'MMMM DD, YYYY at HH:mm ZZ').unix();

    callback(null, ret);
  }));
}

module.exports = parseMatchPage;