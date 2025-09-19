import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to OctaFiles Backend API" });
});

app.listen(PORT, () => {
    console.log(`🚀Server is running on port ${PORT}`);
});
