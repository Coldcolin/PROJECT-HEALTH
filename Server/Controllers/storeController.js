const pharmModel = require("../Models/vendorModel");
const itemsModel = require("../Models/Store");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage}).single("Image")

// const handleErrors = (err)=>{
//     let errors = {email: '', password: '', name: ''}

//     if(err.code === 11000){
//         if(err.keyValue.email){
//             errors.email = "that email already exists"
//             return errors.email
//         }
//         if(err.keyValue.name){
//             errors.name = "that name already exists"
//             return errors.name
//         }
//     }

//     if (err.message.includes('doctor validation')){
//         Object.values(err.errors).forEach(({properties}) =>{
//             errors[properties.path] = properties.message
//         })
//     }
//     return errors
// }

const createItems = async (req, res) => {
	try {
		const Id = req.params.id
		const { name, Category, Type, NAFDAC, API, Price } = req.body;

		const getUser = await pharmModel.findById(Id);
		const createItems = new itemsModel({
			name,
			Category,
			Type,
			NAFDAC,
			API,
			Image: req.file.path,
			Price
		});

		createItems.Owner = getUser;
		createItems.save();

		getUser.Items.push(createItems);
		getUser.save();

		res.status(201).json({
			message: "items has been created",
			// data: createItems,
			// data: getUser
		});
	} catch (error) {
		console.log(error.message)
		res.status(404).json({
			message: error.message,
		});
	}
};

const getItems = async (req, res) => {
	try {
		const id = req.params.id;
		const qNew = req.query.name;
  		const qCategory = req.query.category;
		let query= {};
		if(req.query.keyword){
			query.$or =[
				{"name": {$regex: req.query.keyword, $options: "i"}},
				{"API": {$regex: req.query.keyword, $options: "i"}},
				{"Category": {$regex: req.query.keyword, $options: "i"}}
			]
		}
		let products;

		if (query) {
		products = await itemsModel.find().where("Owner").equals(`${id}`);
		} else {
		products = await itemsModel.find().where("Owner").equals(`${id}`);
		}

		const drugs = await itemsModel.find().where("Owner").equals(`${id}`)
        // const vendor = req.params.pharmID
		// const allItems = drugs.find(query);
		// const show = await allItems.find(query)

		res.status(201).json({
			// total: allItems.length,
			data: products,
			// data: show
		});
	} catch (error) {
		// const errorMessage = handleErrors(err)
        // res.status(400).json({errorMessage})
		console.log(error)
	}
};

const getStore = async(req, res)=>{
	try{
        const storeData = await itemsModel.find()
        res.status(200).json({message: "Store Contents are:", total: storeData.length, data: storeData})
    }catch(error){
        res.status(200).json({message: error.massage})
    }
};


const updateItems = async (req, res) => {
	try {
		if (req.user.isVerify) {
			const { name, description, given, balance, quantity } = req.body;

			const updateData = await itemsModel.findByIdAndUpdate(
				req.params.id,
				req.body,
				{ new: true }
			);
			res.status(201).json({
				message: "updated",
				data: updateData,
			});
		} else {
			res.status(404).json({
				message: "invalid token",
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const deleteItems = async (req, res) => {
	try {
		if (req.user.isVerify && req.user.isAdmin) {
			const user = await userModel.findById(req.params.id);
			const deleteData = await itemsModel.findByIdAndRemove(req.params.id);

			user.item.pull(deleteData);
			user.save();

			res.status(201).json({
				message: "deleted successfully",
			});
		} else {
			res.status(404).json({
				message: "You cannot perform this Task",
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};


module.exports = {
	createItems,
	getItems,
	upload,
	updateItems,
	deleteItems,
	getStore
};
