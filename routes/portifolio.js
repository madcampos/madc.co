/*global __, __n*/
var db = require('../model');

module.exports = function(req, res){
	res.header('Cache-Control', 'public, max-age=2629743830');
	if (req.params.item) {
		if (/\s/g.test(req.params.item)){
			res.redirect(301, '/portifolio/' + req.params.item.replace(' ', '_'));
		} else {
			db.portifolio.findOne({ 'name': decodeURIComponent(req.params.item.replace('_', ' '))}, function(err, item){
				if (err || !item){
					res.redirect('/404');
				} else {
					res.render(
						'portifolio/item',
						{
							'title': item.name + ' @ MADCampos',
							'css': ['portifolio/item', 'portifolio/' + item.css],
							'content': item.content,
							'layout': false
						}
					);
				}
			});
		}
	} else {
		db.portifolio.find(function(err, items){
			if (err) {
				res.redirect('/404');
			} else {
				res.render(
					'portifolio/index',
					{
						'title': 'Portifolio @ MADCampos',
						'css': 'style',
						'items': items
					}
				);
			}
		});
	}

};