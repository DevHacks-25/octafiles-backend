import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import environments from "../environments";
import Client from "../models/Client";
import Advocate from "../models/Advocate";
import Paralegal from "../models/Paralegal";
import Admin from "../models/Admin";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details",
            });
        }
        let user;
        user = await Client.findOne({ email });
        if (!user) user = await Advocate.findOne({ email });
        if (!user) user = await Paralegal.findOne({ email });
        if (!user) user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                username: user.username,
                accountType: user.accountType,
                activationStatus: user.activationStatus,
            };
            let expiry = environments.expiry_jwt;

            if (rememberMe) {
                expiry = environments.expiry_jwt_remembered;
            }

            const token = jwt.sign(payload, environments.jwt_secret as any, {
                expiresIn: expiry as any,
            });

            user = user.toObject() as any;
            user.token = token;
            user.password = undefined;

            return res.status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Password incorrect",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure",
        });
    }
};

export { login };
