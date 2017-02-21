'use strict';
/*eslint no-invalid-this:0*/

import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowercase: true,
        required() {
            return authTypes.indexOf(this.provider) === -1;
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required() {
            return authTypes.indexOf(this.provider) === -1;
        }
    },
    provider: String,
    salt: String,
    facebook: {},
    github: {}
});


UserSchema
    .virtual('profile')
    .get(function () {
        return {
            name: this.name,
            role: this.role
        };
    });

UserSchema
    .virtual('token')
    .get(function () {
        return {
            _id: this._id,
            role: this.role
        };
    });

UserSchema
    .path('email')
    .validate(function (email) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }

        return email.length;
    }, 'Email cannot be blank');


UserSchema
    .path('password')
    .validate(function (password) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }

        return password.length;
    }, 'Password cannot be blank');

UserSchema
    .path('email')
    .validate(function (value, respond) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return respond(true);
        }

        return this.constructor.findOne({email: value}).exec()
            .then(user => {
                if (user) {
                    if (this.id === user.id) {
                        return respond(true);
                    }

                    return respond(false);
                }

                return respond(true);
            })
            .catch(function (err) {
                throw err;
            });
    }, 'The specified email address is already in use.');

const validatePresenceOf = function (value) {
    return value && value.length;
};

UserSchema
    .pre('save', function (next) {
        if (!this.isModified('password')) {
            return next();
        }

        if (!validatePresenceOf(this.password)) {
            if (authTypes.indexOf(this.provider) === -1) {
                return next(new Error('Invalid password'));
            } else {
                return next();
            }
        }

        this.makeSalt((saltErr, salt) => {
            if (saltErr) {
                return next(saltErr);
            }
            this.salt = salt;
            this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
                if (encryptErr) {
                    return next(encryptErr);
                }
                this.password = hashedPassword;
                return next();
            });
        });
    });

UserSchema.methods = {
    authenticate(password, callback) {
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }

        this.encryptPassword(password, (err, pwdGen) => {
            if (err) {
                return callback(err);
            }

            return callback(null, this.password === pwdGen);
        });
    },

    makeSalt(byteSize, callback) {
        const defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
            byteSize = defaultByteSize;
        } else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        } else {
            throw new Error('Missing Callback');
        }

        if (!byteSize) {
            byteSize = defaultByteSize;
        }

        return crypto.randomBytes(byteSize, (err, salt) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, salt.toString('base64'));
            }
        });
    },

    encryptPassword(password, callback) {
        if (!password || !this.salt) {
            if (!callback) {
                return null;
            } else {
                return callback('Missing password or salt');
            }
        }

        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = new Buffer(this.salt, 'base64');

        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, key.toString('base64'));
            }
        });
    }
};

export default mongoose.model('User', UserSchema);
