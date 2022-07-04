const docsModel = require("../Models/docModel")
require("dotenv").config
const verifiedModel = require("../Models/verifiedModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require('multer')
const path = require('path')
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

    if(err.code === 11000){
        if(err.keyValue.email){
            errors.email = "that email already exists"
            return errors.email
        }
        if(err.keyValue.name){
            errors.name = "that name already exists"
            return errors.name
        }
    }

    if (err.message.includes('doctor validation')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}

const createDoc = async (req, res)=>{
    try{    
        const tokenValue = crypto.randomBytes(64).toString("hex")
        const myToken = jwt.sign({ tokenValue }, process.env.SECRET, {
            expiresIn: process.env.EXPIRES
        });
            const newDoc = await docsModel.create({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                Address: req.body.Address,
                Contact: req.body.Contact,
                Avatar: req.file.path,
				Specialty: req.body.Specialty,
				Location: req.body.Location,
				License: req.body.License
            })
            await verifiedModel.create({
                token: myToken,
                userID: newDoc._id,
                _id: newDoc._id,
            })
            const mailOptions ={
                from: process.env.USER,
                to: req.body.email,
                subject: "Account verification",
                html: `
                <h3>
                Thanks for sign up with us ${newDoc.name}, Please use the <a
                href="http://localhost:3000/auth/${newDoc._id}/${myToken}"
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
        const errorMessage = handleErrors(err)
        res.status(400).json({errorMessage})
    }
};

const verifyDoc = async (req, res) => {
	try {
		const doctor = await docsModel.findById(req.params.id);
		if (doctor) {
			if (doctor.verifiedToken !== "") {
				await docsModel.findByIdAndUpdate(
					doctor._id,
					{
						isVerify: true,
						verifiedToken: "",
					},
					{ new: true }
				);
				await verifiedModel.findByIdAndUpdate(
					doctor._id,
					{
						userID: doctor._id,
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
		const errorMessage = handleErrors(err)
        res.status(400).json({errorMessage})
	}
};

const login = async (req, res)=>{
    try{
		const check = await docsModel.findOne({email: req.body.email})
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
        const errorMessage = handleErrors(err)
        res.status(400).json({errorMessage})
    }
};

const forgotPassword = async (req, res) =>{
    try{
        const { email } = req.body;
        const user = await docsModel.findOne({ email});
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
            res.status(404).json({ message: "doctor not found" });
        }
    }catch(err){
        res.status(404).json({message: err.message})
    }
};

const newPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const user = await docsModel.findById(req.params.id);

		if (user) {
			if (user.verifiedToken === req.params.token) {
				const salt = await bcrypt.genSalt(10);
				const hashed = await bcrypt.hash(password, salt);

				await userModel.findByIdAndUpdate(
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
			res.status(201).json({ message: "doctor is not in our database" });
		}
	} catch (error) {
		const errorMessage = handleErrors(err)
        res.status(400).json({errorMessage})
	}
};


const getDocs = async (req, res)=>{
    try{
        const doctors = await docsModel.find()
        res.status(200).json({doctors: doctors})
    }catch(err){
        res.status(404).json({message: err.message})
    }
}

const getSingle = async (req, res)=>{
	try{
		const id = req.params.id;
		const oneUser = await docsModel.findById(id);
		res.status(200).json({data: oneUser})
	}catch(err){
		res.status(400).json({message: err.message})
	}
}



module.exports = {
    createDoc,
    upload,
    verifyDoc,
    login,
    forgotPassword,
    newPassword,
    getDocs,
	getSingle
}