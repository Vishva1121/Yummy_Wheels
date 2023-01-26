const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const itemSchema = new mongoose.Schema({
    username:String,
    hotelId:{
        type:String
    },
    name:{
        type:String,
        required: true
    },
    quantity:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String
    },
    desc:{
        type:String,
    },
    img:String
});

itemSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model("Item", itemSchema);