/*jshint node:true*/
//TODO: sitewide config.
//blog last updated date.
//email
//etc

var mongoose = require('mongoose'),
	Config = mongoose.Schema({
		'name': {
			'type': String,
			'required': true,
			'unique': true
		},
		'value': {
			'type': String,
			'required': true
		}
	});

module.exports = mongoose.model('config', Config);