import mongoose from "mongoose";
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    otp: {type: String,default:null},
    otpTime: {type: Date,default:null},
    likedBlogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;