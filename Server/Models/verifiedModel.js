const mongoose = require("mongoose");
const Schema = mongoose.Schema

const verifiedModel = new Schema(
	{
		token: {
			type: String,
		},
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("verified", verifiedModel);