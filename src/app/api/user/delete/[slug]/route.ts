import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
    await connectDB();

    const slug = params.slug;
    try {
        await User.findByIdAndDelete(slug);
        return Response.json({ message: "User deleted" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}