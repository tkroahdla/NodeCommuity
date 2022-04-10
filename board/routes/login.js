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

router.post('/login',function(req,res){
    console.log(req.body)
    User_info.findOne({id:req.body.id}, function(err, user_info){ //user_info에 결과값을 담는다.
        if(err) return res.json(err);
        console.log(user_info)
        /* 검색결과 존재 */
        if(user_info != null){ 
          /* 비밀번호 일치 */
          // bcrypt.compareSync(입력받은 암호 문자열, db에 있는 해쉬암호값)
          if(bcrypt.compareSync(req.body.password, user_info.password)){
            console.log("비밀번호 일치")

            /* 세션 생성 */
            req.session.userId = user_info;
            console.log(req.session.userId)
            req.session.save(()=>{
              res.render('index',{user_info:req.session.userId}); // db검색값 객체 전체를 넣어준다.
            });
          }

          /* 비밀번호 불일치 */
          else{     
            console.log("비밀번호 불일치")
            res.redirect('/');
          }
        }
        /* 검색결과 없음 */
        else{    
          console.log("존재하지않는 아이디")
          res.redirect('/');
        }
      });
})

module.exports = router;