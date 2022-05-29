const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    task: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User"
    }
},{
    timestamps: true,
    // this add up two two additional fields in the database: created at and updated at.
    // by default it is set to false.
});

const model = mongoose.model("Task", schema);

module.exports = model;