import { Response } from "express";
import AttorneyBooking from "../models/AttorneyBooking";
import { ATTORNEY_TYPE, ATTORNEY_TYPE_ARRAY } from "../constants";
import Advocate from "../models/Advocate";
import Paralegal from "../models/Paralegal";
import Chat from "../models/Chat";
import { createMessageForBooking } from "./message";

const createBooking = async (req: any, res: Response) => {
    try {
        const {
            attorneyId,
            attorneyType,
            subject,
            body,
            category,
            subcategory,
            price,
            guest_emails,
            files = [],
        } = req.body;

        if (
            !attorneyId ||
            !attorneyType ||
            !subject ||
            !body ||
            !category ||
            !subcategory ||
            !price
        ) {
            return res.status(400).json({
                success: false,
                message: "Some fields are missing!",
            });
        }

        const user = req.user;

        if (!ATTORNEY_TYPE_ARRAY.includes(attorneyType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attorney type",
            });
        }

        const AttorneyModel =
            attorneyType === ATTORNEY_TYPE.ADVOCATE ? Advocate : Paralegal;

        const attorney = await AttorneyModel.findOne({
            _id: attorneyId,
            activationStatus: "approved",
        }).lean();

        if (!attorney) {
            return res.status(400).json({
                success: false,
                message: "Attorney not found",
            });
        }

        if (
            !attorney.specializations.find(
                (specialization: any) =>
                    specialization.category === category &&
                    !specialization.subcategories.find(
                        (subcategory: any) => subcategory.name === subcategory
                    )
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Specialization not found",
            });
        }

        const chat = await Chat.create({
            participants: [
                {
                    participant: user.id,
                    participantType: user.accountType,
                },
                {
                    participant: attorney._id,
                    participantType: attorneyType,
                },
            ],
        });

        const { latestMessage } = await createMessageForBooking({
            senderId: user.id,
            senderType: user.accountType,
            subject,
            body,
            files,
            chatId: chat._id.toString(),
        });

        chat.latestMessage = latestMessage;

        const booking = await AttorneyBooking.create({
            client: user.id,
            attorney: attorneyId,
            attorneyType: attorneyType,
            subject,
            body,
            category,
            subcategory,
            price,
            chat: chat._id,
            status: "initiated",
            guest_emails,
        });

        return res.status(200).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createBooking };
