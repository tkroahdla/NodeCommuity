var express = require('express');
var router = express.Router();

const main = require('./main.js')
const user = require('./users.js')
const login = require('./login.js')

router.use('/main',main)
router.use('/users',user)
router.use('/',login)

module.exports = router;
