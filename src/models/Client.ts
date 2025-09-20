import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        activationStatus: {
            type: String,
            default: "approved",
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        accountType: {
            required: true,
            type: String,
        },
        contactNumber: {
            required: true,
            type: Number,
            trim: true,
        },
        image: {
            type: String,
        },
        appointments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment",
            },
        ],
    },
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
