var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log("main session : "+req.session.userId.id)
    res.render('index');
});

module.exports = router;
