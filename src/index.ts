import express from "express";
import mongoose from "mongoose"
import { userModel } from "./models/user.js";
import userRoutes from "./routes/users.js"
import designtocodeRoutes from "./routes/designtocode.js"
import cookieParser from "cookie-parser"
import "dotenv/config";
import cors from 'cors';


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
      origin: "https://ui-component-library-phi.vercel.app",
      //credentials: true, 
    })
  );

mongoose.connect(process.env.MONGODB_URL as string)

mongoose.connection.on("open" , () => {
    console.log("connected to database");
})

app.use("/api/users" , userRoutes);
app.use("/api/designtocode" , designtocodeRoutes);


app.listen(3000 , () =>  {
       console.log("server listening to the port 3000");    
});

