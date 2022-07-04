const vendorModel = require("../Models/vendorModel")
const verifiedModel = require("../Models/verifiedModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require('multer')
const path = require('path');
const crypto = require('crypto');
const transporter  = require("../utils/email")
const { read } = require("fs")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage}).single("Avatar")

const handleErrors = (err)=>{
    let errors = {email: '', password: '', name: ''}

    if (err.message.includes('vendor validation')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}

const createVendor = async (req, res)=>{
    try{    
        const tokenValue = crypto.randomBytes(64).toString("hex")
        const myToken = jwt.sign({ tokenValue }, process.env.SECRET, {
            expiresIn: process.env.EXPIRES
        });
		const salt = await bcrypt.genSalt(10);
    	const bpassword = await bcrypt.hash(req.body.password, salt)
            const newPharm = await vendorModel.create({
                email: req.body.email,
                name: req.body.name,
                password: bpassword ,
                Address: req.body.Address,
                Contact: req.body.Contact,
                Avatar: req.file.path,
				Location: req.body.Location,
				License: req.body.License
            })
            // await verifiedModel.create({
            //     token: myToken,
            //     userID: newPharm._id,
            //     _id: newPharm._id,
            // })
            const mailOptions ={
                from: process.env.USER,
                to: req.body.email,
                subject: "Account verification",
                html: `
                <h3>
                Thanks for sign up with us ${newPharm.name}, Please use the <a
                href="http://localhost:3000/Login"
                >Link to complete your sign up</a>
                </h3>
                `,
            }
            transporter.sendMail(mailOptions,(err, info)=>{
                if(err){
                    console.log(err.message);
                }else{
                    console.log("Email has been sent to your inbox", info.response);
                }
            })
            res.status(200).json({message: "check your mail to continue...", data: myToken})
    }catch(err){
        // const errorMessage = handleErrors(err)
        // res.status(400).json({errorMessage})
		console.log(err)
    }
};

const verifyPharm = async (req, res) => {
	try {
		const pharm = await vendorModel.findById(req.params.id);
		if (pharm) {
			if (pharm.verifiedToken !== "") {
				await vendorModel.findByIdAndUpdate(
					pharm._id,
					{
						isVerify: true,
						verifiedToken: "",
					},
					{ new: true }
				);
				await verifiedModel.findByIdAndUpdate(
					pharm._id,
					{
						userID: pharm._id,
						token: "",
					},
					{ new: true }
				);

				res.status(201).json({
					message: "Verification complete, you can go sign in now!",
				});
			} else {
				res.status(404).json({
					message: error.message,
				});
			}
		} else {
			res.status(404).json({
				message: error.message,
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const login = async (req, res)=>{
    try{
		const check = await vendorModel.findOne({email: req.body.email})
        if(check){
			const pass = req.body.password
            const checkPassword = await bcrypt.compare(pass, check.password)
            if(checkPassword){
				const token = jwt.sign(
					{
						_id: check._id,
						// isVerify: check.isVerify,
						isAdmin: check.isAdmin,
					},
					process.env.SECRET,
					{ expiresIn: process.env.EXPIRES_DATE }
				);
				const { password, ...info } = check._doc;

				res.status(201).json({
					message: `Welcome back ${check.name}`,
					data: { token, ...info },
				});
			}else{
				res.status(400).json({message: "Password incorrect"})
			}
		}else{
			res.status(400).json({message: "User not found"})
		}
    }catch(err){
        res.status(400).json({message: err.message})
    }
};

const forgotPassword = async (req, res) =>{
    try{
        const { email } = req.body;
        const user = await vendorModel.findOne({ email});
        if (user){
            if (user.isVerify && user.verifiedToken === ""){
                const tokenValue = crypto.randomBytes(64).toString("hex");
                const myToken = jwt.sign({ tokenValue }, process.env.SECRET, {expiresIn: process.env.EXPIRES});
                await Users.findByIdAndUpdate(user._id, {
                    verifiedToken: myToken,
                },
                { new: true });

                const mailOptions = {
					from: process.env.USER,
					to: email,
					subject: "Reset Password",
					html: `
            <h3>
            You requested for password reset ${user.name}, Please use the <a
            href="http://localhost:3000/reset/${user._id}/${myToken}"
            >Link to complete your sign up use your secret key to complete this sign up: </a><h2></h2> 
            </h3>
            `,
				};

                transporter.sendMail(mailOptions, (err, info) => {
					if (err) {
						console.log(err.message);
					} else {
						console.log("Email has been sent to your inbox", info.response);
					}
				});

                res.status(201).json({
					message: "Check your inbox to continue...!",
				});
            }else{
                res.status(400).json({ message: "This can't be carried out" });
            }
        }else {
            res.status(404).json({ message: "pharmacy not found" });
        }
    }catch(err){
        res.status(404).json({message: err.message})
    }
};

const newPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const user = await vendorModel.findById(req.params.id);

		if (user) {
			if (user.verifiedToken === req.params.token) {
				const salt = await bcrypt.genSalt(10);
				const hashed = await bcrypt.hash(password, salt);

				await vendorModel.findByIdAndUpdate(
					user._id,
					{
						password: hashed,
						verifiedToken: "",
					},
					{ new: true }
				);

				res.status(201).json({
					message: "Your password has been changed, please sign in now!",
				});
			} else {
				res.status(201).json({ message: "wrong token, access deny" });
			}
		} else {
			res.status(201).json({ message: "pharmacy is not in our database" });
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};


const getVendor = async (req, res)=>{
    try{
		let query= {};
		if(req.query.Location){
			query.Location = req.query.Location;
		}
		if(req.query.keyword){
			query.$or =[
				{"name": {$regex: req.query.keyword, $options: "i"}},
				// {"Location": {$regex: req.query.keyword, $options: "i"}}
			]
		}
		
        const vendors = await vendorModel.find(query)
        res.status(200).json({vendors: vendors})
    }catch(err){
        res.status(404).json({message: err.message})
    }
}
const getSingleVendor = async (req, res)=>{
    try{
		const Id = req.params.Id
        const vendor = await vendorModel.findById(Id)
        res.status(200).json({vendors: vendor})
    }catch(err){
        res.status(404).json({message: err.message})
    }
}


module.exports = {
    createVendor,
    upload,
    login,
    forgotPassword,
    newPassword,
    getVendor,
    verifyPharm,
	getSingleVendor
}