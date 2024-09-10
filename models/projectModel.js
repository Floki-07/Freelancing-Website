const mongoose=require('mongoose')

const projectSchema=mongoose.Schema({
    title:String,
    desc:String,
    skills:String,
    budget:Number,
    deadline:String,
    category:String,
    status:Boolean,
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'client'
    },
    free:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'free'
    },
   
    
})

module.exports=mongoose.model('project',projectSchema )