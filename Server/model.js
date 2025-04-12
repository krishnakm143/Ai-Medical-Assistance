import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    UserName:{type:String, require:true , unique:true},
    Password:{type:String , require:true}
})

const user = mongoose.model('user',userSchema)

module.exports = user;
