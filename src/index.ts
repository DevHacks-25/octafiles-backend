import express from "express";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 8000;

routes(app);

app.listen(PORT, () => {
    console.log(`🚀Server is running on port ${PORT}`);
});
