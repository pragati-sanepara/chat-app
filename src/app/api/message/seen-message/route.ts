import Conversation from "@/Model/Conversation";
import Message from "@/Model/Message";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
    await connectDB();

    try {
        const { msgSentBy, msgSentTo } = await request.json();
        const messages = await Message.updateMany({
            $and: [
                { senderId: msgSentTo },
                { receiverId: msgSentBy },
                { seen: false }
            ]
        }, {
            $set: { seen: true }
        });
        return Response.json({ messages, success: true }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}