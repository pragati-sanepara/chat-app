import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    await connectDB();

    const slug = params.slug;
    try {
        const user = await User.findById({ _id: slug });
        return Response.json({ user, message: "success" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}