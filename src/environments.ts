import dotenv from "dotenv";

dotenv.config();

export default {
    react_app_origin_server: process.env.REACT_APP_ORIGIN_SERVER,
    react_app_allowed_origins: process.env.REACT_APP_ALLOWED_ORIGINS,
    mongodb_url: process.env.MONGODB_URL,
    docuseal_api_key: process.env.DOCUSEAL_API_KEY,
    mail_pass: process.env.MAIL_PASS,
    mail_user: process.env.MAIL_USER,
    mail_host: process.env.MAIL_HOST,
    zoom_meeting_sdk_secret: process.env.ZOOM_MEETING_SDK_SECRET,
    zoom_meeting_sdk_key: process.env.ZOOM_MEETING_SDK_KEY,
    razorpay_secret: process.env.RAZORPAY_SECRET,
    razorpay_key: process.env.RAZORPAY_KEY,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    expiry_jwt: process.env.EXPIRY_JWT,
    expiry_jwt_remembered: process.env.EXPIRY_JWT_REMEMBERED,
};
