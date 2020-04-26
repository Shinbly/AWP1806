const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema (
	{
		name: {
			type: String,
			required: true
		},
		boards: {
			type: Array,
			required: true
		},
		manager: {
			type: String,
			required: true
		},
	});

module.exports = Project = mongoose.model("projects", ProjectSchema);
