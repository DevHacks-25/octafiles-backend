import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import environments from "../environments";
import Client from "../models/Client";
import Advocate from "../models/Advocate";
import Paralegal from "../models/Paralegal";
import Admin from "../models/Admin";
import OTP from "../models/OTP";
import mailSender from "../utils/mailSender";
import passwordUpdated from "../mails/format/passwordUpdated";
import otpGenerator from "otp-generator";

type UserDocument =
    | InstanceType<typeof Client>
    | InstanceType<typeof Advocate>
    | InstanceType<typeof Paralegal>
    | InstanceType<typeof Admin>;

type UserObject = {
    [key: string]: any;
    password?: string;
};

const sendOTP = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
        let temp = await Client.findOne({ email });
        if (temp) {
            return res.status(401).json({
                success: false,
                message: "Email already in used in Client. Please login !",
            });
        }
        temp = await Paralegal.findOne({ email });
        if (temp) {
            return res.status(401).json({
                success: false,
                message: "Email already in used in Paralegal. Please login !",
            });
        }
        temp = await Advocate.findOne({ email });
        if (temp) {
            return res.status(401).json({
                success: false,
                message: "Email already in used in Advocate. Please login !",
            });
        }
        temp = await Admin.findOne({ email });
        if (temp) {
            return res.status(401).json({
                success: false,
                message: "Email already in used in Admin. Please login !",
            });
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp, type: "signup" };
        const otpBody = await OTP.create(otpPayload);
        console.log("otpBODY -> ", otpBody);
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });
    } catch (error: any) {
        console.log("Failed to send OTP.", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const signup = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            Otp,
            contactNumber,
            accountType,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !Otp ||
            !contactNumber ||
            !accountType
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required, enter all",
            });
        }

        let temp =
            (await Client.findOne({ email })) ||
            (await Paralegal.findOne({ email })) ||
            (await Advocate.findOne({ email })) ||
            (await Admin.findOne({ email }));
        if (temp) {
            return res.status(401).json({
                success: false,
                message: `Email already in use in ${temp.accountType}. Please login!`,
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Password and Confirm Password do not match. Please try again.",
            });
        }

        const response = await OTP.find({ email, type: "signup" })
            .sort({ createdAt: -1 })
            .limit(1);

        if (response.length === 0 || Otp !== response[0]?.otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP you entered is not valid or incorrect!!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const generateUsername = async (prefix: string) => {
            let possibleUsername;
            let isUnique = false;
            while (!isUnique) {
                possibleUsername = `${prefix}${Math.floor(
                    1000 + Math.random() * 9000
                )}`;

                if (accountType === "Client") {
                    temp = await Client.findOne({ username: possibleUsername });
                } else if (accountType === "Paralegal") {
                    temp = await Paralegal.findOne({
                        username: possibleUsername,
                    });
                } else if (accountType === "Advocate") {
                    temp = await Advocate.findOne({
                        username: possibleUsername,
                    });
                } else if (accountType === "Admin") {
                    temp = await Admin.findOne({ username: possibleUsername });
                }

                if (!temp) {
                    isUnique = true;
                }
            }
            return possibleUsername;
        };

        let user;
        const usernamePrefixes = {
            Client: "CL-",
            Paralegal: "PL-",
            Advocate: "AC-",
            Admin: "AD-",
        };
        const usernamePrefix =
            usernamePrefixes[accountType as keyof typeof usernamePrefixes];
        const username = await generateUsername(usernamePrefix);

        const userParams = {
            firstName,
            lastName,
            username,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
                `${firstName} ${lastName}`
            )}`,
        };

        if (accountType === "Client") {
            user = await Client.create(userParams);
        } else if (accountType === "Paralegal") {
            user = await Paralegal.create(userParams);
        } else if (accountType === "Advocate") {
            user = await Advocate.create(userParams);
        } else if (accountType === "Admin") {
            user = await Admin.create(userParams);
        }

        user = user?.toObject() as any;
        user.password = undefined;

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

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
            user.appointments = undefined;

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

const refresh = async (req: any, res: Response) => {
    try {
        let tempUser = req.user;

        let { email } = tempUser;
        let user = await Client.findOne({ email });
        if (!user) user = await Advocate.findOne({ email });
        if (!user) user = await Paralegal.findOne({ email });
        if (!user) user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            username: user.username,
            accountType: user.accountType,
            activationStatus: user.activationStatus,
        };

        const newToken = jwt.sign(payload, environments.jwt_secret as any, {
            expiresIn: environments.expiry_jwt as any,
        });

        return res.status(200).json({
            success: true,
            token: newToken,
            message: "Token refreshed successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Refresh failure",
        });
    }
};

const me = async (req: any, res: Response) => {
    try {
        const tempUser = req.user;
        const { email } = tempUser;

        let user: UserDocument | null = await Client.findOne({ email });
        if (!user) user = await Advocate.findOne({ email });
        if (!user) user = await Paralegal.findOne({ email });
        if (!user) user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong",
            });
        }

        const userObject = user.toObject() as UserObject;
        userObject.password = undefined;

        return res.status(200).json({
            success: true,
            user: userObject,
            message: "User fetched successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Me failure",
        });
    }
};

const forgotPassword = async (req: any, res: Response) => {
    try {
        const { otp, email, newPassword, confirmPassword } = req.body;

        const response = await OTP.find({ email, type: "forgotPassword" })
            .sort({ createdAt: -1 })
            .limit(1);

        if (response.length === 0 || otp !== response[0]?.otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Confirm and New password are not matching",
            });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        let updatedUserDetails = await Client.findOneAndUpdate(
            { email },
            { password: encryptedPassword },
            { new: true }
        );

        if (updatedUserDetails === null) {
            updatedUserDetails = await Advocate.findOneAndUpdate(
                { email },
                { password: encryptedPassword },
                { new: true }
            );
        }

        if (updatedUserDetails === null) {
            updatedUserDetails = await Paralegal.findOneAndUpdate(
                { email },
                { password: encryptedPassword },
                { new: true }
            );
        }

        if (updatedUserDetails === null) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        try {
            await mailSender(
                email,
                `Password updated successfully`,
                passwordUpdated(
                    email,
                    `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully");
        } catch (error: any) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error: any) {
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};

const forgotPasswordOTP = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
        let checkUserPresent = null;
        if (checkUserPresent === null) {
            checkUserPresent = await Client.findOne({ email: email });
        }
        if (checkUserPresent === null) {
            checkUserPresent = await Paralegal.findOne({ email: email });
        }
        if (checkUserPresent === null) {
            checkUserPresent = await Advocate.findOne({ email: email });
        }

        console.log(email);
        console.log(checkUserPresent);

        if (!checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User doesn't exist",
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP Generated::", otp);

        let result = await OTP.findOne({ otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({ otp });
        }

        const otpPayload = { email, otp, type: "forgotPassword" };
        const otpBody = await OTP.create(otpPayload);
        console.log("Otp Body::", otpBody);
        return res.status(200).json({
            success: true,
            message: "OTP Sent SUCCESSFULLY !!",
        });
    } catch (error: any) {
        console.error("Error occurred while sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while sending OTP",
            error: error.message,
        });
    }
};

const verifyServiceProvidersForm = async (req: any, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Service providers form verified successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while verifying service providers form",
            error: error.message,
        });
    }
};

export {
    login,
    signup,
    refresh,
    me,
    forgotPassword,
    sendOTP,
    forgotPasswordOTP,
    verifyServiceProvidersForm,
};
