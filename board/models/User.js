var mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/* DB schema - 회원 */
var user_info = mongoose.Schema({
    id:{type:String, required:[true,'id is required'], unique:true},
    name:{type:String,required:[true,'id is required']},
    password:{type:String,required:true},
    regDate: {type: Date, index:{unique:false}, default: Date.now()}
    },
    {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

// user_info.virtual('_passwordConfirmation')
//  .get(function(){ return this._passwordConfirmation; })
//  .set(function(value){ this._passwordConfirmation=value; });

user_info.pre('save',function(next){
  var user = this
  if(user.isModified('password')){
    user.password= bcrypt.hashSync(user.password, 13)
    next();
  }
  else{
    next();
  }
})

var User_info = mongoose.model('user_info', user_info);
module.exports = User_info;

