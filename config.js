/*jshint node:true*/
var colors = require('colors'),
	express = require('express'),
	ejs = require('ejs'),
	parse = ejs.parse,
	compress = require('./compress'),
	partials = require('express-partials'),
	less = require('less-middleware'),
	passport = require('passport'),
	i18n = require('i18n'),
	SessionStore = require('./model').SessionStore(express);

/**
 * Queue flash `msg` of the given `type`.
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
function flash(options){
	options = options || {};
	var safe = (options.unsafe === undefined) ? true : !options.unsafe;

	return function(req, res, next) {
		var format = require('util').format;

		if (req.flash && safe) { return next(); }

		req.flash = function(type, msg) {
			if (this.session === undefined) {
				throw Error('req.flash() requires sessions');
			}
			var msgs = this.session.flash = this.session.flash || {};
			if (type && msg) {
				if (arguments.length > 2 && format) {
					var args = Array.prototype.slice.call(arguments, 1);
					msg = format.apply(undefined, args);
				}
				return (msgs[type] = msgs[type] || []).push(msg);
			} else if (type) {
				var arr = msgs[type];
				delete msgs[type];
				return arr || [];
			} else {
				this.session.flash = {};
				return msgs;
			}
		};
		next();
	};
}

module.exports = function(app) {
	app.configure('development', function(){
		app.use(express.errorHandler());
		app.use(express.logger('dev'));
	});

	app.configure(function(){
		//Compile, compress & gzip
		app.use(compress({
			'level': 9,
			'memLevel': 9,
			'filter': function(req, res){
				return (/x-icon|json|text|javascript|less|rss|atom|kml|rdf|svg|xml/).test(res.getHeader('Content-Type'));
			}
		}));
		ejs.parse = function(str, options) {
			str = str.replace(/<!--[\s\S]*?-->/g, '');
			str = str.replace(/^\s+|\s+$|\n/gm, '');
			return parse.apply(this, [str, options]);
		};
		app.use(less({
			'src' : __dirname + '/less',
			'dest' : __dirname + '/public/style',
			'prefix': '/style',
			'compress': true,
			'optimization': 2,
			'force': true
		}));

		//I18n
		i18n.configure({
			'locales': ['en', 'pt-br', 'pt']
		});
		app.use(i18n.init);

		//Views
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.set('view options', { layout: __dirname + 'views/meta/layout.ejs' });
		app.engine('ejs', ejs.renderFile);
		app.use(partials());
		app.use(express.favicon(__dirname + '/public/img/favicon/favicon.ico'));
		app.use(express.static(__dirname + '/public', {'maxAge': '31556926000'}));

		//Security & auth
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({ key: 'express.sid', secret: 'hue hue hue br br br gib money plox', 'store': new SessionStore()}));
		app.use(express.csrf());
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.disable('x-powered-by');

		//Router: need to be placed last
		app.use(app.router);
		app.locals.__ = i18n.__;
		app.locals.__n = i18n.__n;
	});
};