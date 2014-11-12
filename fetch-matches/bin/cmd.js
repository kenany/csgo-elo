#!/usr/bin/env node

var minimist = require('minimist');
var fetchMatches = require('../');

var argv = minimist(process.argv.slice(2));

fetchMatches(argv._).pipe(process.stdout);