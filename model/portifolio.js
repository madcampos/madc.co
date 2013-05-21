var mongoose = require('mongoose'),
	PortifolioItem = mongoose.Schema({
		'name': {
			'type': String,
			'required': true,
			'unique': true,
			'index': true
		},
		'description': {
			'type': String,
			'required': true
		},
		'content': {
			'type': String,
			'required': true
		},
		'css': String,
		'thumb': String,
		'type': String
	});
module.exports = mongoose.model('portifolioItem', PortifolioItem);