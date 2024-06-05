import User from "@/Model/User";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    await connectDB()
    try {
        const searchQueryParam = req.nextUrl.searchParams.get("search");
        if (searchQueryParam) {
            const users = await User.find({ name: searchQueryParam });
            return Response.json(users, { status: 200 });
        }
        const users = await User.find({});
        return Response.json(users, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}