import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import environments from "../environments";

const auth = (req: any, res: Response, next: NextFunction) => {
    try {
        console.log("Currently going through middleware");
        const token = req?.header("Authorization")?.replace("Bearer ", "");
        console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            const decode = jwt.verify(token, environments.jwt_secret);
            console.log(decode);
            req.user = decode;
            req.token = token;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is INVALID",
            });
        }
        console.log(req.user.accountType);
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

export { auth };
