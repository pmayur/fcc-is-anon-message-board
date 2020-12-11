const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
    {
        board: {
            type: String,
            minlength: 1,
            required: true,
        },
        text: {
            type: String,
            minlength: 1,
            required: true,
        },
        delete_password: {
            type: String,
            minlength: 1,
            required: true,
        },
        reported: {
            type: Boolean,
            default: false,
        },
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Reply",
            },
        ],
    },
    {
        timestamps: {
            createdAt: "created_on",
            updatedAt: "bumped_on",
        },
    }
);

const Thread = mongoose.model("Thread", ThreadSchema);

module.exports = Thread;
