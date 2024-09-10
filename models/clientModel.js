const mongoose=require('mongoose')

const clientSchema=mongoose.Schema({
    name:String,
    cname:String,
    email:String,
    phone:Number,
    desc:String,
    website:String,
    password:String,   
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'project'
    }],
   
    
})

module.exports=mongoose.model('client',clientSchema )