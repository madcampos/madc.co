var mongoose = require('mongoose'),
	Url = mongoose.Schema({
		'path': {
			'type': String,
			'required': true,
			'unique': true
		},
		'name': {
			'type': String,
			'required': true
		},
		'description': String,
		'translation': [
			{
				'path': String,
				'lang': String,
				'description': String
			}
		]
	});

module.exports = mongoose.model('url', Url);