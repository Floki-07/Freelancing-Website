const mongoose=require('mongoose')


mongoose.connect("mongodb://localhost:27017/FreelanceHub")

const freeSchema=mongoose.Schema({
    name:String,
    email:String,
    skills:Array,
    exp:Number,
    qual:String,
    desc:String,
    password:String,
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"project"
    }],
    rating:{
        type:Number,
        default:0
    },

})

module.exports=mongoose.model('freelancer',freeSchema )