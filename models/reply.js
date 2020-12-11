const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReplySchema = new Schema(
    {
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Thread",
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
    },
    {
        timestamps: {
            createdAt: "created_on",
            updatedAt: "bumped_on",
        },
    }
);

const Reply = mongoose.model("Reply", ReplySchema);

module.exports = Reply;
