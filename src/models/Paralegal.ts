import mongoose from "mongoose";

const paralegalSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        username: { type: String, required: true },
        password: { type: String, required: true, select: false },
        accountType: { required: true, type: String },
        contactNumber: { required: true, type: Number, trim: true },
        activationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "unverified"],
            default: "pending",
        },
        remark: { type: String },
        image: {
            type: String,
        },
        facilitiesNservices: [
            {
                category: { type: String, required: true },
                subcategories: [{ type: String, required: true }],
            },
        ],
        price: {
            type: Number,
        },
        yearsOfExp: {
            type: String,
        },
        dob: {
            type: String,
        },
        timeForServe: [
            {
                day: { type: String, required: true },
                slots: [
                    {
                        from: { type: String, required: true },
                        to: { type: String, required: true },
                    },
                ],
            },
        ],
        prefferedLanguages: [{ type: String }],
        achievementAndComments: { type: String },
        appointments: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
        ],
    },
    { timestamps: true }
);

const Paralegal = mongoose.model("Paralegal", paralegalSchema);
export default Paralegal;
