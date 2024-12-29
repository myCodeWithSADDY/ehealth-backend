import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
dotenv.config();
const mongoURI = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import { connectDB } from "./config/database.js";
import { corsOptions } from "./config/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

export const adminSecretKey = process.env.adminSecretKey;

connectDB(mongoURI);

const app = express();

//socket settings
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});
app.set("io", io);
app.use(cookieparser());
app.use(cors());
app.use(express.json());

//setting up io connection or circuit connection
io.use((socket, next) => {
  cookieparser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.user.name);
});

app.use("/api/", userRoutes);
app.use("/api/admin", adminRoutes);

io.on("Disconnect", (socket) => {
  console.log("a user disconnected", socket.user.name);
});

server.listen(PORT, () => {
  console.log(`sever is running on port ${PORT}`);
});
