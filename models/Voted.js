const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require('joi-objectid')(Joi);

const votedSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rollNo:{
        type:String,
        required:true
    },
    categoryId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
    },
    voteCount:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
})

const Voted = mongoose.model("Voted",votedSchema);

function VotedValidate(voted){
    const schema = Joi.object({
        name:Joi.string().required(),
        rollNo:Joi.string().required(),
        categoryId:Joi.objectId().required(),
        image:Joi.string().default("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
    })
    return schema.validate(voted)
}


exports.Voted =Voted;
exports.validate = VotedValidate;
