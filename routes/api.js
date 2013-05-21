/*global rootPath, __, __n, req, res*/
var model = require('../model'),
	isEmpty = function(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
			return true;
		}
	},
	isFilled = function(req, options, messages) {
		for (var i in options){
			if (!req.body.hasOwnProperty(options[i])) {
				req.flash('error', messages[i]);
				return false;
			}
		}
		return true;
	};

exports.url = function(req, res){
	if (isEmpty(req.body)) {
		req.flash('error', 'Empty form');
		res.redirect('/admin');
	} else {
		if (isFilled(req, ['path', 'name', 'description'], ['Missing path', 'Missing name', 'Missing description'])) {
			var url = new model.url({'name': req.body.name, 'path': req.body.path, 'description': req.body.description});
			url.save(function(err){
				if (err) {
					req.flash('error', 'Error at saving');
				} else {
					req.flash('info', 'Saved sucessfuly');
				}
				res.redirect('/admin');
			});
		} else {
			res.redirect('/admin');
		}
	}
};