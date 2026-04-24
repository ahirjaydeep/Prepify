import dotenv from "dotenv";
import { connectDB } from "./database/db.connect.js";
import server from "./server.js";
dotenv.config();
connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});