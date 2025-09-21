import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import environments from "../environments";
import userRoutes from "./user";
import attorneyRoutes from "./attorney";

const apiLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();

    res.on("finish", () => {
        const duration = performance.now() - start;
        console.log(
            `${req.method} ${req.originalUrl} ${
                res.statusCode
            } - ${duration.toFixed(2)} ms`
        );
    });

    next();
};

export = (app: express.Application) => {
    app.use(
        cors({
            origin: environments.react_app_allowed_origins,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(apiLogger);

    app.use("/auth", userRoutes);
    app.use("/attorneys", attorneyRoutes);
};
