var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, lowercase: true },
  password: String,

});


module.exports = mongoose.model('User', userSchema);
