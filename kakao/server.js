const express= require('express');
const app = express();
const nunjucks = require('nunjucks');
const axios = require('axios').default;
const passport = require('passport');
const qs = require('qs');
const session = require('express-session');
require('dotenv').config({path: __dirname + '\\' + '.env'});
 
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
})
 
app.use(session({
    secret: process.env.SECRET,
    resave:true,
    secure:false,
    saveUninitialized:false,
}))//세션을 설정할 때 쿠키가 생성된다.&&req session의 값도 생성해준다. 어느 라우터든 req session값이 존재하게 된다.
 
const kakao = {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    redirectUri: process.env.redirectUri
}
//profile account_email
app.get('/auth/kakao',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile_nickname,profile_image`;
    res.redirect(kakaoAuthURL);
})
 
app.get('/auth/kakao/callback', async(req,res)=>{
    //axios>>promise object
    try{//access토큰을 받기 위한 코드
    token = await axios({//token
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:qs.stringify({
            grant_type: 'authorization_code',//특정 스트링
            client_id:kakao.clientID,
            client_secret:kakao.clientSecret,
            redirectUri:kakao.redirectUri,
            code:req.query.code,//결과값을 반환했다. 안됐다.
        })//객체를 string 으로 변환
    })
}catch(err){
    res.json(err.data);
}
//access토큰을 받아서 사용자 정보를 알기 위해 쓰는 코드
    let user;
    try{
        console.log(token);//access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
        user = await axios({
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`
            }//헤더에 내용을 보고 보내주겠다.
        })
    }catch(e){
        res.json(e.data);
    }
    
    // console.log(user.data.kakao_account.profile);
    // console.log(user.data);

 
    req.session.kakao = user.data;
    console.log(token.data.access_token)
    //req.session = {['kakao'] : user.data};
    
    res.send('success');
})
 
 
app.get('/auth/info',(req,res)=>{
    let {profile_nickname,profile_image}=req.session.kakao.properties;
    res.render('info',{
        profile_nickname,profile_image,
    })
})
 
// 카카오 로그아웃
// auth//kakao/logout
app.get('/auth/logout', async (req,res)=>{
    // https://kapi.kakao/com/v1/user/logout
    try {
      const ACCESS_TOKEN = token.data.access_token;
      let logout = await axios({
        method:'post',
        url:'https://kapi.kakao.com/v1/user/unlink',
        headers:{
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
    // 세션 정리
    // req.logout();
    req.session.destroy();
    
    res.redirect('/');
  })
// token.data.access_token
// app.get('/auth/logout', async function (req, res, next) {
//     var session = req.session;
//     try {
//         if (session.kakao) { //세션정보가 존재하는 경우
//             console.log('존재한다.')
//             await req.session.destroy(function (err) {
//                 if (err)
//                     console.log(err)
//                 else {
//                 //   res.redirect('/');
//                 }
//             })
//         }
//         console.log('존재하지않다.')
//     }
//     catch (e) {
//       console.log(e)
//     }
//   res.redirect('/');
// })

app.get('/',(req,res)=>{
    res.render('index');
});





app.get(kakao.redirectUri)
 
app.listen(3000, ()=>{
    console.log(`server start 3000`);
})

