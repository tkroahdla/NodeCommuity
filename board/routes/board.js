var express = require('express');
var router = express.Router();
var board = require('../models/Board');
const multer = require('multer')
const upload = multer({dest: '../boardimg/'}) //dest : 저장 위치


router.get('/', function(req, res) {
    board.find({}, function(err, boards){
        if(err) return res.json(err);
        res.render('board', {boards:boards});
      });
});

/* boards - New */
router.get('/new', function(req, res){
    res.render('board_new');
  });
  
  /* boards - create */
  router.post('/new',upload.single('img'), function(req, res){
    req.body.writer= req.session.userId.name
    // console.log(req.session.userId.id)
    board.create(req.body, function(err, board){
      if(err){
          res.write("<script>alert('제목 중복!!')</script>");
         return res.write("<script>window.location='/board'</script>");
        // return res.json(err);
      } 
    //   res.json(req.file)
    //   console.log(req.file)
      res.redirect('/board');
    });
  });

  /* boards - show */
  router.get('/:id', function(req, res){
    board.findOne({_id:req.params.id}, function(err, board){
      if(err) return res.json(err);
      res.render('board_show',{board:board});
    });
  });

module.exports = router;
