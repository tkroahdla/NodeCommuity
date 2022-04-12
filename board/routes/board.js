var express = require('express')
var router = express.Router();
var mongoose = require('mongoose');
const bcrypt = require('bcrypt')

/* DB setting */
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
}); 

/* DB schema - 회원 */
var user_info = mongoose.Schema({
    id:{type:String, required:true, unique:true},
    password:{type:String},
    name:{type:String}
  });
var User_info = mongoose.model('user_info', user_info);

router.get('/', function(req, res) {
    res.render('login');
});