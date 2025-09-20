import mongoose from "mongoose";
import mailSender from "../utils/mailSender";
import emailTemplate from "../mails/format/emailVerificationFormat";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
});

async function sendVerificationEmail(email: string, otp: string) {
    try {
        const mailResponse = await mailSender(
            email,
            `${otp} is your otp for verification - Octafiles`,
            emailTemplate(otp)
        );
        console.log("Email Sent Successfully!! => ", mailResponse);
    } catch (error) {
        console.log("Error While Sending Email ! ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;
