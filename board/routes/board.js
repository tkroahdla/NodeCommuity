var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log("Board!!!!!")
    // console.log("Board session : "+req.session.userId.id)
    res.render('board');
});

module.exports = router;
