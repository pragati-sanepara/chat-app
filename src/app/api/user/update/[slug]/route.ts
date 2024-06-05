import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
    await connectDB();

    const slug = params.slug;
    try {
        const body = await request.json();
        const user = await User.findById(slug);
        if (!user) {
            return Response.json({ message: "User not exist" }, { status: HttpStatusCode.NotFound });
        }
        if (body.name) {
            user.name = body.name;
        }
        if (body.email) {
            user.email = body.email;
        }
        user.save();
        return Response.json({ data: user, message: "User updated" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}