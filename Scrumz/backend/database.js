//backend/databse.js

const mongoose = require("mongoose");
const Schema = mongoose.schema;

//base database structure
const DataSchema = new Schema(
	{
		id: Number,
		username: String,
		email: String,
		password: String,
		profile_picture_url: String
	},
);

//export the schema to modify it
module.exports = mongoose.model("Data", DataSchema);
