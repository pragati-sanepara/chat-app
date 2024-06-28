import Conversation from "@/Model/Conversation";
import connectDB from "@/lib/db";
import { HttpStatusCode } from "axios";
import mongoose from "mongoose";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    await connectDB();

    const slug = new mongoose.Types.ObjectId(params.slug);
    try {
        // $or: [
        //     { senderId: slug.receiverId, receiverId: slug.senderId },
        //     { senderId: slug.senderId, receiverId: slug.receiverId }
        // ]

        // const conversation = await Conversation.aggregate([
        //     {
        //         $match: {
        //             $or: [
        //                 { senderId: slug },
        //                 { receiverId: slug }
        //             ]
        //         }
        //     },
        //     {
        //         $addFields: {
        //             messages: { $first: "$messages" }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "messages",
        //             localField: "messages",
        //             foreignField: "_id",
        //             as: "messages",
        //             pipeline: [
        //                 {
        //                     $project: {
        //                         text: 1,
        //                         updatedAt: 1,
        //                     }
        //                 }
        //             ],
        //         }
        //     },
        //     {
        //         $addFields: {
        //             messages: { $first: "$messages" }
        //         }
        //     },
        //     {
        //         $addFields: {
        //             name: { $cond: { if: { $eq: ["$senderId", slug] }, then: "$receiverId", else: "$senderId" } }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "name",
        //             foreignField: "_id",
        //             as: "name",
        //             pipeline: [
        //                 {
        //                     $project: {
        //                         name: 1
        //                     }
        //                 }
        //             ],
        //         }
        //     },
        //     {
        //         $addFields: {
        //             name: { $first: "$name" }
        //         }
        //     },
        //     {
        //         $sort: { updatedAt: -1 }
        //     },
        //     {
        //         $lookup: {
        //             from: "messages",
        //             let: { conversationId: "$_id", senderId: "$senderId", receiverId: "$receiverId", seen: "$seen" },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 {
        //                                     $or: [
        //                                         { $eq: ["$senderId", slug] },
        //                                         { $eq: ["$receiverId", slug] }
        //                                     ]
        //                                 },
        //                                 { $eq: ["$seen", false] }
        //                             ]
        //                         }
        //                     }
        //                 },
        //                 {
        //                     $count: "unseenMessagesCount"
        //                 }
        //             ],
        //             as: "unseenMessages"
        //         }
        //     },
        //     {
        //         $replaceWith: {
        //             unseenMessagesCount: {
        //                 $ifNull: [{ $arrayElemAt: ["$unseenMessages.unseenMessagesCount", 0] }, 0]
        //             }
        //         },
        //     },
        // ]);

        const conversation = await Conversation.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: slug },
                        { receiverId: slug }
                    ]
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "messages",
                    pipeline: [
                        {
                            $sort: {
                                _id: -1
                            }
                        },
                        {
                            $project: {
                                text: 1,
                                updatedAt: 1,
                                receiverId: 1,
                                seen: 1,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    unseen: {
                        $reduce: {
                            input: "$messages",
                            initialValue: 0,
                            in: {
                                $cond: [
                                    { $and: [{ $eq: ["$$this.receiverId", slug] }, { $eq: ["$$this.seen", false] }] },
                                    { $add: ["$$value", 1] },
                                    "$$value"
                                ]
                            }
                        }
                    },
                    chatId: {
                        $cond: {
                            if: {
                                $eq: ["$senderId", slug]
                            },
                            then: "$receiverId",
                            else: "$senderId"
                        }
                    },
                    lastmessage: { $first: "$messages" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "chatId",
                    foreignField: "_id",
                    as: "name",
                }
            },
            {
                $addFields: {
                    name: { $first: "$name.name" },
                    userId: { $first: "$name._id" }
                }
            },
            {
                $project: {
                    senderId: 0,
                    receiverId: 0,
                    __v: 0,
                    messages: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    chatId: 0,
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]);

        // const conversation = await Conversation.find({
        //     $or: [
        //         { senderId: slug.receiverId }, { receiverId: slug.receiverId }
        //     ]
        // }).populate(["messages", "senderId", "receiverId"]);
        return Response.json({ conversation, message: "success" }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: HttpStatusCode.BadRequest });
    }
}