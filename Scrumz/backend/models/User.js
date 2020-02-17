const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema (
	{
		//id: Number,
		username: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		//profile_picture_url: String
	});

module.exports = User = mongoose.model("users", UserSchema);
