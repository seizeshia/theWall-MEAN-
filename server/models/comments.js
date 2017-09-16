var mongoose = require('mongoose')
var schema = mongoose.Schema;
var CommentSchema = mongoose.Schema({
  message:{type:schema.Types.ObjectId, ref:'Message'},
  comment:String,
  support:String,
  _user:{type: schema.Types.ObjectId, ref:'Users'},
  likes:[{type:schema.Types.ObjectId, ref:'Users'}]
}, {timestamps:true})
mongoose.model('Comment', CommentSchema)
