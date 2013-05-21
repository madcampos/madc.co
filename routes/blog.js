/*global __, __n*/
var db = require('../model');

module.exports = function(req, res){
	res.header('Cache-Contorl', 'public, max-age=2629743830');
	if (req.params.post) {
		if (/\s/.test(req.params.post)) {
			res.redirect(301, '/blog/' + req.params.post.replace(' ', '_'));
		} else {
			db.blog.post.findOne({'name': decodeURIComponent(req.params.post.replace('_', ' '))}, function(err, post){
				if (err || !post) {
					res.redirect('/404');
				} else {
					res.render(
						'blog/post',
						{
							'title': post.title + ' @ MADCampos',
							'body': post.content,
							'layout': false,
							'comments': post.comments
						}
					);
				}
			});
		}
	} else {
		db.blog.post.count(function(err, count){
			db.blog.post.find().limit(10).exec(function(err, posts){
				if (err) {
					res.redirect('/404');
				} else {
					res.render(
						'blog/index',
						{
							'title': 'Blog @ MADCampos',
							'totalPosts': count,
							'posts': posts,
							'css': 'style'
						}
					);
				}
			});
		});

	}
};