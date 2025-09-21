import { Schema, model } from "mongoose";

const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            refPath: "senderType",
            required: true,
        },
        senderType: {
            type: String,
            enum: ["Client", "Advocate", "Paralegal"],
            required: true,
        },
        subject: {
            type: String,
        },
        body: {
            type: String,
        },
        file: {
            type: String,
        },
        contentType: {
            type: String,
            enum: ["text", "image", "audio", "video"],
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
    },
    { timestamps: true }
);

const Message = model("Message", messageSchema);
export default Message;
