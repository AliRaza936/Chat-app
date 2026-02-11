import app from "./src/app.ts";
import { connectDB } from "./src/config/database.ts";
import dotenv from "dotenv";

dotenv.config();

let PORT = process.env.PORT || 3000;
connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
}).catch((err)=>{
    console.log('Failed to start server',err);
    process.exit(1);
})