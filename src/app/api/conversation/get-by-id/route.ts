import Conversation from "@/Model/Conversation";
import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
    await connectDB();

    try {
        const { id } = await request.json();
        const conversation = await Conversation.find({
            $or: [
                { senderId: id }, { receiverId: id }
            ]
        }).populate(["messages", "senderId", "receiverId"]);
        const user = await User.findById(id);
        return Response.json({ conversation, user, message: "success" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}