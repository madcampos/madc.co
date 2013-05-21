var colors = require('colors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('./user'),
	Portifolio = require('./portifolio'),
	Blog = require('./blog'),
	Config = require('./config'),
	URL = require('./url'),
	Session = require('./session');

passport.use(new LocalStrategy({'usernameField': 'email'}, User.verify()));
passport.serializeUser(User.serialize());
passport.deserializeUser(User.deserialize());

function connect(dbString){
	mongoose.connection.on('open', function(){
		console.log('Mongo DB connection'.green);
	});
	mongoose.connection.on('error', function(err){
		console.log('Mongo DB connection error:'.red);
		console.log(err.message.red);
	});

	console.log('Starting Mongo DB connection'.cyan);
	mongoose.connect('localhost', dbString);
}

function SessionStore(connect) {
	function MongooseStore(options) {
		options = options || {};
		connect.session.Store.call(this, options);
	}
	MongooseStore.prototype.__proto__ = connect.session.Store.prototype;

	MongooseStore.prototype.get = function(sid, callback) {
		Session.findById(sid, function(err, sess){
			if (err) {
				callback(err, null);
			} else {
				if (sess) {
					if (!sess.expires || new Date() < sess.expires) {
						callback(null, JSON.parse(sess.session));
					} else {
						sess.findByIdAndRemove(sid, {'session': JSON.stringify(sess)}, callback);
					}
				} else {
					callback(null);
				}
			}
		});
	};

	MongooseStore.prototype.set = function(sid, sess, callback) {
		var s = {'session': JSON.stringify(sess)};

		if (sess && sess.cookie) {
			if (sess.cookie.expires) {
				s.expires = new Date(sess.cookie.expires);
			} else {
				var today = new Date(),
				twoWeeks = 1000 * 60 * 60 * 24 * 14;
				s.expires = new Date(today.getTime() + twoWeeks);
			}
		}
		Session.findByIdAndUpdate(sid, s, {upsert: true, safe: true}, callback);
	};

	MongooseStore.prototype.destroy = function(sid, sess, callback) {
		Session.findByIdAndRemove(sid, {'session': JSON.stringify(sess)}, callback);
	};

	MongooseStore.prototype.length = function(callback) {
		Session.count({}, callback);
	};

	MongooseStore.prototype.clear = function(callback) {
		Session.remove({}, callback);
	};

	return MongooseStore;
}

module.exports = {
	'connect':  connect,
	'user': User,
	'portifolio': Portifolio,
	'blog': Blog,
	'config': Config,
	'url': URL,
	'session': Session,
	'SessionStore': SessionStore
};