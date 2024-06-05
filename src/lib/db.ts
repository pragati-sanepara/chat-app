import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

export default async function connectDB() {
    try {
        const response = await mongoose.connect(DATABASE_URL!);
        console.log("Database connected " + response.connection.host);
    } catch (error) {
        console.log("error", error);
    }
}