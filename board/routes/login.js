var express = require('express')
var router = express.Router();
const bcrypt = require('bcrypt')
var User_info = require('../models/User');


router.get('/', function(req, res) {
    res.render('login');
});

/* 회원가입 */
router.post('/new', function(req, res){
    User_info.create(req.body, function(err, user_info){
      if(err) return res.json(err);
      res.redirect('/');
    });
  });

/* 로그인 */
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
              res.redirect('/board'); // db검색값 객체 전체를 넣어준다.
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


router.get('/create', (req, res, next) => {
  User.findOne({ id: 'test', pwd: 'test' }, (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (!user) {
      const userData = {
        id: process.env.USER_ID,  // User ID
        pwd: process.env.USER_PW,  // User PW
      };
      User.create(userData, (err, user) => {
        if (err) next(err);
        else return res.redirect('/login');
      });
    }
    return res.redirect('/login');
  });
});
