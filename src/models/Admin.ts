import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
        role: {
            type: String,
            enum: ["super", "normal"],
            default: "normal",
        },
        rights: [
            {
                type: String,
                enum: ["blog", "webinar", "client", "attorney", "content"],
                default: [],
            },
        ],
        activationStatus: {
            type: String,
            default: "approved",
        },
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
