const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColumnSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        tasks: {
            type: [String],
            required: true
        },
        movableByMembers: {
            type: Boolean,
            required: true
        },
        limitation: {
            type: Number,
            required: false
        }
    });

module.exports = Column = mongoose.model("columns", ColumnSchema);
