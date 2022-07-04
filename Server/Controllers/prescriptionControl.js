const prescriptionModel = require("../Models/prescriptionModel")
const userModel = require("../Models/model");
const docModel = require("../Models/docModel")
require("dotenv").config

const createPres = async(req, res) => {
    try{
        const userId = req.params.userId;
        const docId = req.params.docId;
        const user = await userModel.findById(userId);
        const doctor = await docModel.findById(doocId);
        const prescript = await prescriptionModel({
            prescription: req.body.prescription
        });
        prescript.user = user;
        prescript.doctor = doctor;
        prescript.save();
        user.prescriptions.push(prescript);
        user.save()
        doctor.Prescriptions.push(prescript);
        doctor.save()
        res.status(200).json({message: "Prescription created"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
};

const getPresc = async(req, res) =>{
    try{
        const prescript = await prescriptionModel.find()
        res.status(200).json({data: prescript})
    }catch(err){
        res.status(400).json({message: err.message})
    }
};

const getUserPresc = async(req, res) =>{
    try{
        const userId = req.params.userId
        const prescript = await prescriptionModel.find().where("user").equals(`${userId}`)
        res.status(200).json({data: prescript})
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

module.exports = {
    createPres,
    getPresc,
    getUserPresc,
}