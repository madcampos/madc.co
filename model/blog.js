var mongoose = require('mongoose'),
	config = require('./config'),
	emailValidate = function(email){
		return (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(email);
	},
	urlValidate = function(url){
		return (/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/).test(url);
	},
	Post = mongoose.Schema({
		'title': {
			'type': String,
			'required': true
		},
		'content': {
			'type': String,
			'required': true
		},
		'comments':[{
			'person': {
				'name': {
					'type': String,
					'required': true
				},
				'email': {
					'type': String,
					'required': true,
					'validate': emailValidate
				},
				'site': {
					'type': String,
					'validate': urlValidate
				}
			},
			'comment': String,
			'date': {
				'type': Date,
				'default': Date.now()
			}
		}],
		'pubdate': {
			'type': Date,
			'default': Date.now()
		},
		'updated': {
			'type': Date,
			'default': Date.now()
		},
		'tags': [String]
	}),
	Tag = mongoose.Schema({
		'name': {
			'type': String,
			'required': true
		},
		'items': [{
			'type': mongoose.Types.ObjectId,
			'ref': 'Post'
		}]
	});
Post.virtual('categories').get(function(){
	return this.tags;
}).set(function(categories){
	this.tags = categories;
});
Post.virtual('link').get(function(){
	return encodeURIComponent(this.title.replace(' ', '_'));
}).set(function(link){
	this.title = decodeURIComponent(link.replace('_', ' '));
});
Post.pre('save', function(next){
	config.findOneAndUpdate({'name': 'blogLastUpdated'}, {'value': Date.now().toString()}, {'upsert': true});
});
exports.post = mongoose.model('post', Post);
exports.tag = mongoose.model('tag', Tag);