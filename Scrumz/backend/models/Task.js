
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        assignTeamMembers: {
            type: [String],
            required: false
        },
        duration: {
            type: Number,
            required: false
        },
        deadline: {
            type: Date,
            required: false
        },
        priority: {
            type: Number,
            required: false
        },
        acceptance: {
            type: Boolean,
            required: false
        },
        test: {
            type: String,
            required: false
        },
		color: {
            type: String,
            required: false
        },

    });

module.exports = Task = mongoose.model("tasks", TaskSchema);
