var mongoose = require('mongoose')
var schema = mongoose.Schema;
var MessageSchema = mongoose.Schema({
  comment: [{type:schema.Types.ObjectId, ref:'Comment'}],
  message:String,
  desc:String,
  _user:{type:schema.Types.ObjectId, ref:'Users'},
  count:[{type:schema.Types.ObjectId, ref:'Users'}]
}, {timestamps:true})
mongoose.model('Message', MessageSchema)
