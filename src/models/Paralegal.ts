import mongoose from "mongoose";

const paralegalSchema = new mongoose.Schema(
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
        dob: {
            type: Date,
        },
        activationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "unverified"],
            default: "pending",
        },
        remark: {
            type: String,
        },
        hourlyRate: {
            type: Number,
        },
        yearsOfExp: {
            type: String,
        },
        image: {
            type: String,
        },
        specializations: [
            {
                category: {
                    type: String,
                    required: true,
                },
                subcategories: [
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        price: {
                            type: Number,
                            required: true,
                        },
                    },
                ],
            },
        ],
        minPrice: {
            type: Number,
        },
        timeForServing: [
            {
                day: {
                    type: String,
                    required: true,
                },
                slots: [
                    {
                        from: {
                            type: String,
                            required: true,
                        },
                        to: {
                            type: String,
                            required: true,
                        },
                    },
                ],
            },
        ],
        languages: [
            {
                type: String,
            },
        ],
        achievementAndComments: [
            {
                type: String,
            },
        ],
        appointments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment",
            },
        ],
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        /* Address */
        address: {
            addr_line1: {
                type: String,
            },
            addr_line2: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
            },
            zipCode: {
                type: String,
            },
        },
        jurisdiction: [
            {
                state: {
                    type: String,
                },
                barCouncilNumber: {
                    type: String,
                    trim: true,
                },
            },
        ],
        bio: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        responseTime: {
            type: String,
        },
        // To be added in future
        completedCases: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Paralegal = mongoose.model("Paralegal", paralegalSchema);
export default Paralegal;
