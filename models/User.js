const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true,"Please provide a username"]
    },
    email:{
        type:String,
        required:[true,"please provide a email"],
        unique: true,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            "please provide a valid email"
        ]
    },
    pwd:{
        type:String,
        required:[true,"Please add a password"],
        minlength:6,
        select:false
    },
    isadmin:{ type: Boolean,
        default: false},
    resetPasswordToken:String,
    resetPasswordExpire: Date
});

UserSchema.pre("save",async function(next){
    if(!this.isModified("pwd")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.pwd = await bcrypt.hash(this.pwd,salt)
    next();
});

UserSchema.methods.matchPassword = async function(pwd){
    return await bcrypt.compare(pwd,this.pwd);
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({ id: this._id},process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRE})
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); //Ten munites

    return resetToken;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;