const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Username is required',
    unique: true,
  },
  hashed_password: {
    type: String,
    required: 'Password cannot be blank',
  },
  salt: { type: String, default: '' },
  facebookId: { type: Number },
});

UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Username is already in use'));
  } else {
    next(error);
  }
});

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

UserSchema.statics = {
  load: function (options, cb) {
    options.select = options.select || 'username';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
};

mongoose.model('User', UserSchema);

module.exports = {
  User: mongoose.model('User'),
}
