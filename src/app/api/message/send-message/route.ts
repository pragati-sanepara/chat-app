import Conversation from "@/Model/Conversation";
import Message from "@/Model/Message";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function POST(req: Request) {
    await connectDB();
    try {
        const { msgSentBy, msgSentTo, message } = await req.json();
        const msgCreated = await Message.create({
            text: message,
            senderId: msgSentBy,
            receiverId: msgSentTo,
            seen: msgSentBy === msgSentTo ? true : false,
        });
        let conversation = await Conversation.findOne({
            $or: [
                { senderId: msgCreated.senderId, receiverId: msgCreated.receiverId },
                { senderId: msgCreated.receiverId, receiverId: msgCreated.senderId },
            ]
        });
        if (!conversation) {
            conversation = await Conversation.create({
                senderId: msgSentBy,
                receiverId: msgSentTo,
            });
        }
        await Conversation.findByIdAndUpdate(conversation._id, {
            $push: { messages: msgCreated._id }
        }).populate("messages");

        const conversationData = await Conversation.findOne({
            $or: [
                { senderId: msgSentBy, receiverId: msgSentTo },
                { senderId: msgSentTo, receiverId: msgSentBy }
            ]
        }).populate("messages");

        return Response.json({ conversationData, data: 'Success' }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}

