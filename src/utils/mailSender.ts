import nodemailer from "nodemailer";

const mailSender = async (email: string, title: string, body: string) => {
    try {
        console.log("Starting mail sending process...");

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        console.log("Transporter created successfully.");

        // Verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log("Error in verifying transporter configuration.");
                console.log(error.message);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        let info = await transporter.sendMail({
            from: "OctaFiles <info@octafiles.com>",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Mail sent successfully!");
        console.log(info); // Information about the sent email

        return info;
    } catch (error: any) {
        console.log("Error in sending mail.");
        console.log(`Error at: ${error.stack}`); // Log stack trace for better debugging
        throw new Error(error.message); // Throw the error to propagate it to the calling function if needed
    }
};

export default mailSender;
