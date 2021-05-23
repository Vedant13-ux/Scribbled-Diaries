const mongoose=require('mongoose');
const convSchema=new mongoose.Schema({
    between:String,
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }
    ]
});
module.exports=mongoose.model('Conversation',convSchema)