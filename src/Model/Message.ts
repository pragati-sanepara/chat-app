import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        senderId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User",
        },
        receiverId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User",
        },
        seen: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;