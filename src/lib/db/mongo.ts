import mongoose from "mongoose";
import environments from "../../environments";
require("dotenv").config();

const connect = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(environments.mongodb_url);
            console.log("✅ Successfully connected to MongoDB");
        }
        return mongoose.connection.db;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export { connect };
