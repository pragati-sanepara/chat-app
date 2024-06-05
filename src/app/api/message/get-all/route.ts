import Message from "@/Model/Message";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function GET() {
    await connectDB();
    try {
        const messages = await Message.find({});
        return Response.json(messages, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}