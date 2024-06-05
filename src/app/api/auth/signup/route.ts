import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";

export async function POST(req: Request) {
    await connectDB();
    try {
        const { name, email, password } = await req.json();
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return Response.json({ message: "Email already exist" }, { status: HttpStatusCode.BadRequest });
        }
        await User.create({
            name: name,
            email: email,
            password: password
        });
        return Response.json({ message: "Account successfully created" }, { status: HttpStatusCode.Created });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}