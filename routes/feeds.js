/*global __, __n*/
//TODO: http://atompub.org/ and http://www.rssboard.org/rsscloud-interface
var db = require('../model');

/**
 * RSS Feed
 */
exports.rss = function(req, res){
	res.header('Cache-Control', 'public, max-age=2629743830');
	res.type('rss');

	var xml = '<?xml version="1.0" encoding="utf-8"?>';
	xml += '<rss version="2.0">';
	xml += '<channel>';
	xml += '<title>Blog @ MADcampos</title>';
	xml += '<link>' + res.locals.rootPath + '/blog</link>';
	xml += '<description>' + __('Estudante de Ciência da Computação pela UFMT, intusiasta por design, usabilidade e desenvolvimento de jogos e web.') + '</description>';
	xml += '<language>pt-br</language>';
	xml += '<managingEditor>maurelio.campos@gmail.com</managingEditor>';
	xml += '<image>';
	xml += '<url>' + res.locals.rootPath + '/img/feed/logo.png</url>';
	xml += '<title>MADCampos</title>';
	xml += '<link>' + res.locals.rootPath + '/blog</link>';
	xml += '<width>100</width>';
	xml += '<height>100</height>';
	xml += '</image>';

	db.blog.post.find({}, function(err, feeds){
		if (err) {
			xml += '</channel>';
			xml += '</rss>';
			res.send(xml);
		} else {
			db.config.findOne({'name': 'updated'}, function(err, updated){
				if (err || !updated) {
					xml += '</channel>';
					xml += '</rss>';
					res.send(xml);
				} else {
					xml += '<lastBuildDate>' + updated +'</LastBuildDate>';
					for (var feed in feeds) {
						xml += '<item>';
						xml += '<title>' + feeds[feed].title + '</title>';
						xml += '<guid>' + feeds[feed].id +'</guid>';
						xml += '<link>' + feeds[feed].link + '</link>';
						xml += '<pubDate>' + feeds[feed].pubdate +'</pubDate>';
						xml += '<category>' + feeds[feed].categories.toString() +'</category>';
						xml += '<author>' + feeds[feed].author +'</author>';
						xml += '<comments>' + feeds[feed].link +'</comments>';
						xml += '<description>' + feeds[feed].content +'</description>';
						xml += '</item>';
					}
					xml += '</channel>';
					xml += '</rss>';
					res.send(xml);
				}
			});
		}
	});
};

/**
 * Atom Feed
 */
exports.atom = function(req, res){
	res.header('Cache-Control', 'public, max-age=2629743830');
	res.type('atom');

	var xml = '<?xml version="1.0" encoding="utf-8"?>';
	xml += '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">';
	xml += '<title>Blog @ MADCampos</title>';
	xml += '<id>' + res.locals.rootPath + '/blog</id>';
	xml += '<author>';
	xml += '<name>Marco Aurélio Dilda Campos</name>';
	xml += '<email>maurelio.campos@gmail.com</email>';
	xml += '<uri>' + res.locals.rootPath + '</uri>';
	xml += '</author>';
	xml += '<link href="' + res.locals.rootPath + '/blog"/>';
	xml += '<link href="' + res.locals.rootPath + '/atom/" rel="self"/>';
	xml += '<link href="' + res.locals.rootPath + '"/>';
	xml += '<subtitle>' + __('Estudante de Ciência da Computação pela UFMT, intusiasta por design, usabilidade e desenvolvimento de jogos e web.') + '</subtitle>';
	xml += '<icon>' + res.locals.rootPath + '/img/feed/logo.png</icon>';

	db.blog.post.find({}, function(err, feeds){
		if (err) {
			xml += '</feed>';
			res.send(xml);
		} else {
			db.config.findOne({'name': 'updated'}, function(err, updated){
				if (err || !updated) {
					xml += '</feed>';
					res.send(xml);
				} else {
					xml += '<updated>' + updated + '</updated>';
					for (var feed in feeds) {
						xml += '<entry>';
						xml += '<title>' + feeds[feed].title + '</title>';
						xml += '<id>' + feeds[feed].id + '</id>';
						xml += '<link rel="alternate" href="' + feeds[feed].link + '">';
						xml += '<published>' + feeds[feed].pubdate + '</published>';
						xml += '<updated>' + feeds[feed].updated + '</updated>';
						for (var category in feeds[feed].categories) {
							xml += '<category term="' + feeds[feed].categories[category] + '" label="' + feeds[feed].categories[category] + '">';
						}
						xml += '<author>';
						xml += '<name>' + feeds[feed].author + '</name>';
						xml += '</author>';
						xml += '<content>' + feeds[feed].content + '</content>';
						xml += '</entry>';
					}
					xml += '</feed>';
					res.send(xml);
				}
			});
		}
	});
};