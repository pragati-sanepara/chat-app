import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    await connectDB();
    try {
        const { email, password } = await req.json();
        const user = await User.findOne({ email }).select("+password");
        console.log("existEmail", user);
        if (!user) {
            return Response.json({ message: "User not found" }, { status: HttpStatusCode.NotFound });
        }

        if (user.password !== password) {
            return Response.json({ message: "Password does not match" }, { status: HttpStatusCode.BadRequest });
        }

        cookies().set("userId", user._id);
        return Response.json({ id: user._id, message: "Signin successfully" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}