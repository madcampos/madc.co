/*jshint node:true*/
var mongoose = require('mongoose'),
	emailValidate = function(email){
		return (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(email);
	},
	crypto = require('crypto'),
	User = mongoose.Schema({
		'name': String,
		'permission': {
			'type': String,
			'required': true,
			'default': 'user'
		},
		'email': {
			'type': String,
			'unique': true,
			'required': true,
			'index': true,
			'validate': emailValidate
		},
		'salt': {
			'type': String,
			'required': true
		},
		'hash': {
			'type': String,
			'required': true
		}
	});

User.methods.setPassword = function (password, next) {
	var self = this;
	if (!password) {
		return next(new Error("Password argument not set!"));
	}

	crypto.randomBytes(32, function(err, buf) {
		var salt = buf.toString('hex');

		crypto.pbkdf2(password, salt, 25000, 512, function(err, hashRaw) {
			if (err) { return next(err); }

			self.hash = new Buffer(hashRaw).toString('hex');
			self.salt = salt;

			next(null, self);
		});
	});
};

User.methods.authenticate = function(password, next) {
	var self = this;
	crypto.pbkdf2(password, self.salt, 25000, 512, function(err, hashRaw) {
		if (err) { return next(err); }

		var hash = new Buffer(hashRaw).toString('hex');

		if (hash === self.hash) {
			return next(null, self);
		} else {
			return next(null, false, { message: 'Incorrect password' });
		}
	});
};

User.statics.verify = function(){
	var self = this;
	return function(username, password, next) {
		self.findByUsername(username, function(err, user) {
			if (err) { return next(err); }

			if (user) {
				return user.authenticate(password, next);
			} else {
				return next(null, false, { message: 'Incorrect username' });
			}
		});
	};
};

User.statics.serialize = function(){
	return function(user, next) {
		next(null, user.email);
	};
};

User.statics.deserialize = function(){
	var self = this;
	return function(username, next) {
		self.findByUsername(username, next);
	};
};

User.statics.findByUsername = function(username, next) {
	this.findOne({'email': username}, next);
};

User.statics.register = function(user, password, next) {
	if (!user.email) {
		return next(new Error('Email not set'));
	}

	// Create instances of this to ensure that user is an instance of user prototype
	user = new this(user);

	var self = this;
	self.findByUsername(user.email, function(err, existingUser) {
		if (err) { return next(err); }

		if (existingUser) {
			return next(new Error('User already exists with email ' + user.email));
		}

		user.setPassword(password, function(err, user) {
			if (err) {
				return next(err);
			}

			user.save(function(err) {
				if (err) {
					return next(err);
				}

				next(null, user);
			});
		});
	});
};

module.exports = mongoose.model('user', User);