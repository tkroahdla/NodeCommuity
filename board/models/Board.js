var mongoose = require('mongoose')

/* DB schema - 게시물 */
var board = mongoose.Schema({
    title:{type:String, required:true, unique:true},
    content:{type:String},
    writer:{type:String},
    regDate: {type: Date, index:{unique:false}, default: Date.now()}
  });
  var Board = mongoose.model('board', board);

  module.exports = Board;