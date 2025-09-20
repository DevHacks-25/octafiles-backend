import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        givenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        givenTo: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "givenToType",
            required: true,
        },
        givenToType: {
            type: String,
            enum: ["Advocate", "Paralegal"],
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
