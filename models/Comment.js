const mongoose = require('mongoose');
// database for storing comments
const commentSchema = new mongoose.Schema({
    name: String,
    comments: String,
    date: {
        type: Date, default: Date.now
    }

});

const CommentInfo = mongoose.model('comments', commentSchema);

module.exports = CommentInfo; //inside models->Comments.js