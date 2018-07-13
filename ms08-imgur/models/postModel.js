let mongooose = require('mongoose');
let postSchema = new mongooose.Schema({
    url: {
        type: String,
        required: true,
        trim:true
    },likes: {
        type: Number,
        required: false,
        default: 0   
    },
    tags: {
        type: Array,
        required: false,
        default: []
    },
    date:{
        type: Date,
        default: Date.now()
    },
    uid:{
        type: String,
        required: true
    }
});

let Post = mongooose.model('Post', postSchema);

module.exports = Post;