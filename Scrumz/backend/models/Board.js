const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema (
	{
		name: {
			type: String,
			required: true
		},
		columns: {
			type: Array,
			required: true
		},
		members: {
			type: [String],
			required: true
		},
		manager: {
			type: String,
			required: true
		},
		archived_tasks: {
			type: Array,
			required: false
		},
		logs: {
			type: Array,
			required: false
		}
	});

module.exports = Board = mongoose.model("boards", BoardSchema);
