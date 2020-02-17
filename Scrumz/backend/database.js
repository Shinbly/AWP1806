//backend/databse.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//base database structure
const DataSchema = new Schema(
	{
		id: Number,
		message: String
	},
);

//export the schema to modify it
module.exports = mongoose.model("Data", DataSchema);
