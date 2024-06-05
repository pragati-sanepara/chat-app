import Conversation from "@/Model/Conversation";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
    await connectDB();

    try {
        const { msgSentBy, msgSentTo } = await request.json();
        const conversation = await Conversation.findOne({
            $or: [
                { senderId: msgSentBy, receiverId: msgSentTo },
                { senderId: msgSentTo, receiverId: msgSentBy }
            ]
        }).populate("messages");
        return Response.json({ conversation, message: "success" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}