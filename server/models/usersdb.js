var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  username: String,
}, {timestamps: true})
mongoose.model('Users', UserSchema);
