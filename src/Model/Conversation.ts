import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
    {
        messages: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Message",
            }
        ],
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
    },
    {
        timestamps: true,
    },
);

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
export default Conversation;