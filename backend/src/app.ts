import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import chatRoutes from "./routes/chatRoutes.ts";
import messageRoutes from "./routes/messageRoutes.ts";

import userRoutes from "./routes/userRoutes.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { clerkMiddleware } from "@clerk/express";
let app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use('/api/auth',authRoutes)
app.use('/api/chats',chatRoutes)
app.use('/api/messages',messageRoutes)
app.use('/api/users',userRoutes)

app.use(errorHandler)
export default app; 