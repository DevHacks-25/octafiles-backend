import { Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";

const getAllChats = async (req: any, res: Response) => {
    try {
        const user = req.user;
        const chats = await Chat.find({
            participants: {
                $elemMatch: { participant: user.id },
            },
        })
            .populate("latestMessage")
            .populate("participants");

        return res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            data: chats,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllMessages = async (req: any, res: Response) => {
    try {
        const user = req.user;
        const { chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }

        const chat = await Chat.find({
            _id: chatId,
            participants: { $elemMatch: { participant: user.id } },
        });

        if (!chat) {
            return res.status(400).json({
                success: false,
                message: "Chat not found",
            });
        }

        const messages = await Message.find({ chat: chatId });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { getAllMessages, getAllChats };
