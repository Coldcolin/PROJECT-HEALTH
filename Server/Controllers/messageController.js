const messageModel = require("../Models/messageModel")
const userModel = require("../Models/model")
const docModel = require("../Models/docModel")

const sendMessage = async (req, res)=>{
    try{
        const userId = req.params.userId;
        const docId = req.params.docId
        const newMessage = await messageModel({
            message: req.body.message
        })
        const user = await userModel.findById(userId)
        const doctor = await docModel.findById(docId)
        user.messages.push(newMessage)
        doctor.messages.push(newMessage)
        newMessage.Sender = user;
        newMessage.Receiver = doctor;
        user.save()
        doctor.save() 
        newMessage.save()
        res.status(200).json({data: newMessage})
    }catch(err){
        res.status(400).json({message: err.message})
        console.log(err)
    }
}

module.exports = {
    sendMessage
}