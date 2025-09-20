import express from "express";
import routes from "./routes";
import { connect } from "./lib/db/mongo";

const app = express();
const PORT = process.env.PORT || 8000;

connect();

routes(app);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
