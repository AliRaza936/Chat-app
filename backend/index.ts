import { clerkMiddleware } from "@clerk/express";
import app from "./src/app.ts";
import { connectDB } from "./src/config/database.ts";
import dotenv from "dotenv";
import { createServer } from "http";
import { initailizeSocket } from "./src/utils/socket.ts";

dotenv.config();


const httpServer = createServer(app);
// app.use(clerkMiddleware())
initailizeSocket(httpServer);
let PORT = process.env.PORT || 3000;


connectDB().then(()=>{
httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
}).catch((err)=>{
    console.log('Failed to start server',err);
    process.exit(1);
})