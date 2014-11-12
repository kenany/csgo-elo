# gosugamers-match

[![Build Status][travis-svg]][travis]
[![Dependency Status][gemnasium-svg]][gemnasium]

Parse a CS:GO match page from GosuGamers.

GosuGamers provides no API so I have no choice but to download their HTML pages,
parse the HTML for important stuff, and parse that stuff into appropriate
JavaScript values. With dependencies this module is like 84 kB minified and
gzipped which is just ridiculous.

## Example

``` javascript
var gosugamersMatch = require('gosugamers-match');

gosugamersMatch('excessively long gosugamers url', function(error, data) {
  if (error) {
    throw error;
  }

  console.log(data);
  // => {
  // =>   opponent1: 'Team LDLC',
  // =>   opponent2: 'fnatic',
  // =>   score1: 1,
  // =>   score2: 3,
  // =>   date: 1415548800
  // => }
});
```

## Installation

``` bash
$ npm install gosugamers-match
```

## API

``` javascript
var gosugamersMatch = require('gosugamers-match');
```

### `gosugamersMatch(url, callback)`

Calls `callback(error, data)`, where `error` is any _Error_ encounted and `data`
is an _Object_ containing some info on the match described in _String_ `url`.


   [travis]: https://travis-ci.org/KenanY/gosugamers-match
   [travis-svg]: https://img.shields.io/travis/KenanY/gosugamers-match.svg
   [gemnasium]: https://gemnasium.com/KenanY/gosugamers-match
   [gemnasium-svg]: https://img.shields.io/gemnasium/KenanY/gosugamers-match.svg
