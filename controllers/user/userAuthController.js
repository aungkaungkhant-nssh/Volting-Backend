const {User,validate} = require("../../models/User");
const _= require('lodash');
const Joi = require("joi");
const crypto = require("crypto");
const Token = require("../../models/Token");
const sendEmail = require("../../util/email");

//@desc userRegister
//@route POST /api/user/register
exports.userRegister = async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    const {name,email,password}  = req.body
    try{
        let existEmailAddress = await User.findOne({email});
        if(existEmailAddress) return res.status(402).send({message:"Your Email Address is already exist"});
        let user =  new User({name,email,password});
        user = await user.save();
        let token = await user.generateToken();

        let mailToken = new Token({
            userId:user._id,
            token:crypto.randomBytes(32).toString("hex")
        })
        mailToken =await mailToken.save();
        const message = `${process.env.BASE_URL}/user/verify/${user._id}/${mailToken.token}`;

        await sendEmail(user.email,"Verify Email",message);

        res.status(201).json({message:"Register Successfully",data:{..._.pick(user,["_id","name","email","vt"]),token}})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong"})
    }
}

//@desc userLogin
//@route POST /api/user/login


exports.userLogin = async (req,res)=>{
    const {error} = validateLogin(req.body);
    if(error) return res.status(402).json({message:error.details[0].message});
    let {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user.verified) return res.status(400).json({message:"Your email is not verified"})
        if(user && await user.matchPassword(password)){
            let token = await user.generateToken();
            res.status(200).json({message:"Login successfully",data:{..._.pick(user,["_id","name","email","vt"]),token}})
        }else{
            res.status(400).json({message:"Your Email Or Password Invalid"})
        }
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.emailVerify = async(req,res)=>{
    try{
        const user  = await User.findById(req.params.id);
        if(!user) return res.status(400).json({message:"Invalid Link"});
        const token  = await Token.findOne({userId:user._id,token:req.params.token});
        if(!token) return res.status(400).json({message:"Invalid Link"});
        await User.findOneAndUpdate({_id:user._id},{verified:true});
        await Token.findByIdAndRemove(token._id);
        res.status(200).json({message:"Email Verify Success",data:{emailVerified:true}})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong"});
}
} 

function validateLogin (user){
    const schema = Joi.object({
        email:Joi.string().required(),
        password:Joi.string().required()
    })
    return schema.validate(user);
}

