const mongoose = require('mongoose');


/* DB schema - 회원 */
var user_info = mongoose.Schema({
    id:{type:String, required:true, unique:true},
    password:{type:String},
    name:{type:String}
  });

var User_info = mongoose.model('user_info', user_info);
module.exports = User_info;