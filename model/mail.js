var mongoose = require('mongoose'),
	Mail = mongoose.Schema({
		'from': {
			'type': String,
			'required': true
		},
		'to': [String],
		'subject': String,
		'message': String
	});