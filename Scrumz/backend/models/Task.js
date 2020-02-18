
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
            required: true
        },
        assignTeamMembers: {
            type: [String],
            required: true
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


    });

module.exports = Task = mongoose.model("tasks", TaskSchema);
