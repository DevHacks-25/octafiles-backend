import { Schema, model } from "mongoose";

const chatSchema = new Schema(
    {
        participants: [
            {
                participant: {
                    type: Schema.Types.ObjectId,
                    refPath: "participantType",
                    required: true,
                },
                participantType: {
                    type: String,
                    enum: ["Client", "Advocate", "Paralegal"],
                    required: true,
                },
            },
        ],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    { timestamps: true }
);

const Chat = model("Chat", chatSchema);
export default Chat;
