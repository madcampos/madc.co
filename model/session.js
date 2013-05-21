var mongoose = require('mongoose'),
	Session = mongoose.Schema({
		'expires': Date,
		'session': String
	});

module.exports = mongoose.model('session', Session);