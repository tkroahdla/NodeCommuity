var express = require('express');
var router = express.Router();
var board = require('../models/Board');
const multer = require('multer')
// const upload = multer({dest: '../uploadedFiles/'}) //dest : 저장 위치
const storage = multer.diskStorage({
  destination: (req, file, callback)=>{
    callback(null, "../uploadedFiles/");
  },
  filename: (req,file,callback) => {
    callback(null, file.originalname);
  }
})
const upload = multer({storage:storage})

// /* boards - Index */
// router.get('/', function(req, res) {
//     board.find({}, function(err, boards){
//         if(err) return res.json(err);
//         res.render('board', {boards:boards});
//       });
// });

/* boards - Index */
router.get('/',async function(req, res) {
  var page = Math.max(1, parseInt(req.query.page));   // 2
  var limit = Math.max(1, parseInt(req.query.limit)); // 2
  page = !isNaN(page)?page:1;                         // 3
  limit = !isNaN(limit)?limit:10;                     // 3

  var skip = (page-1)*limit; // 4
  var count = await board.countDocuments({}); // 5
  var maxPage = Math.ceil(count/limit); // 6
  var boards = await board.find({}) // 7
    .populate('writer')
    .sort('-regDate')
    .skip(skip)
    .limit(limit)
    .exec();

      res.render('board', {
        boards:boards,
        currentPage:page,
        maxPage:maxPage,
        limit:limit
      });
  });


/* boards - New */
router.get('/new', function(req, res){
    res.render('board_new');
  });

  /* boards - create */
  router.post('/new',upload.single('img'), function(req, res){
    // console.log(req.file.originalname);
    console.log(req.body)

    req.body.writer = "textId"
    req.body.img = req.file.originalname;
    board.create(req.body, function(err, board){
      if(err){
          res.write("<script>alert('제목 중복!!')</script>");
         return res.write("<script>window.location='/board'</script>");
      } 
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
