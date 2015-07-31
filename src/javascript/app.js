var bespoke = require('bespoke');
var classes = require('bespoke-classes');
var bullets = require('bespoke-bullets');
var touch = require('bespoke-touch');
var forms = require('bespoke-forms');
var keys = require('bespoke-keys');
var hash = require('bespoke-hash');

var deck = bespoke.from('#slides', [
	classes(), bullets('.bullet'), keys(), touch(), hash(), forms(),
]);
