import mongoose from "mongoose";
const schema = mongoose.Schema;


const blogSchema = new schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    author:{type: String, required: true},
    image: {type: String},
    likes: {type: Number, default: 0},
    comments: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        comment: {type: String}
    }],
    date: {type: Date, default: Date.now}
}, {timestamps: true});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;