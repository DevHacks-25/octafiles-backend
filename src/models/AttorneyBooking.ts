import { Schema, model } from "mongoose";

const attorneyBookingSchema = new Schema(
    {
        client: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        attorney: {
            type: Schema.Types.ObjectId,
            refPath: "attorneyType",
            required: true,
        },
        attorneyType: {
            type: String,
            enum: ["Advocate", "Paralegal"],
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        body: {
            type: String,
        },
        category: {
            type: String,
        },
        subcategory: {
            type: String,
        },
        price: {
            type: Number,
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
        },
        status: {
            type: String,
            enum: [
                "initiated",
                "ongoing",
                "scheduled",
                "completed",
                "cancelled",
            ],
            default: "initiated",
        },
        guest_emails: [
            {
                type: String,
            },
        ],
        hasClientApproved: {
            type: Boolean,
            default: true,
        },
        hasGuestApproved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const AttorneyBooking = model("AttorneyBooking", attorneyBookingSchema);

export default AttorneyBooking;
