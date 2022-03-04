const crypto = require('crypto');
// const { use } = require('express/lib/application');
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail')



exports.register = async (req,res,next) =>{
    const {username,email,pwd} = req.body;


    // if (!username || !email || !password )
    // return res.status(400).json({ msg: "Not all fields have been entered." });
    if (pwd.length < 5)
        return res.status(400).json({ msg: "The password needs to be at least 5 characters long." });
    // if (password !== repeatpassword)
    //     return res.status(400).json({ msg: "Enter the same password twice for verification." });
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail)
        return res.status(400).json({ msg: "An account with this email already exists." });
    const existingUser = await User.findOne({ username: username });
    if (existingUser)
        return res.status(400).json({ msg: "An account with this username already exists." });

    try{
        // Store data in the db User
        const user = await User.create({
            username,
            email,
            pwd,
        });
        // Call the function sendToken
        sendToken(user,201,res);
        
    }catch(error){
        next(error);
    }
};

// {"email":"hary1234@gmail.com","password":"1234567"}
exports.login = async (req,res,next) =>{
    const { username,pwd } = req.body;

    if(!username || !pwd){
        return next(new ErrorResponse("Please provide an email and password",400));
    }
    try{
        const user = await User.findOne({username}).select("+pwd");

        if(!user){
            return next(new ErrorResponse("Invalid Credentials",401));

        }
        const isMatch = await user.matchPassword(pwd);

        if(!isMatch){
            return next(new ErrorResponse("Invalid Credentials",401))
        }
        sendToken(user,200,res);
    }catch(error){
        next(error)       
    }
};

exports.forgotpassword = async (req,res,next) =>{

    const { email } = req.body;

    try{

        const user = await User.findOne({email});

        if(!user){
            return next(new ErrorResponse("Email could not be sent",404))
        }
        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/api/auth/resetpassword/${resetToken}`;

        const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try{

            await sendEmail({
                to: user.email,
                subject:"Password Reset Request",
                text:message
            })

            res.status(200).json({ success: true, data: "Email Sent"});

        }catch(error){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be send",500))
            
        }
    }catch(error){
        next(error)

    }
    
};

exports.resetpassword = async (req,res,next) =>{
    const resetPasswordToken = crypto
    .createHash("sha256").update(req.params.resetToken).digest("hex");
    console.log(resetPasswordToken);
    try{
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        })

        if(!user){
            return next(new ErrorResponse("Invalid Reset Token",400))
        }
        user.pwd = req.body.pwd;
        console.log(user.pwd)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

         res.status(200).json({
            success: true,
            data:"Password Reset Sucess",
            token: user.getSignedToken(),
        })
    }catch(error){
        next(error)

    }
};

// user indicate data in model each user is a user
const sendToken = (user,statusCode,res) =>{
    const token = user.getSignedToken();
    res.status(statusCode).json({ success:true,token})
}