import express from "express";
import mongoose from "mongoose"
import { userModel } from "./models/user.js";
import userRoutes from "./routes/users.js"
import "dotenv/config";
import cors from 'cors';


const app = express();



app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173"
    })
  );

mongoose.connect("mongodb+srv://govindharajanandhan1950:O26L1JuwPQtsMYQG@maincluster.31xxd.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster/DUI")

mongoose.connection.on("open" , () => {
    console.log("connected to database");
})

app.use("/api/users" , userRoutes);


// app.post(("/signup") , async (req , res) => {

//      try {

          
//           const newuser = new userModel({
//              username : req.body.username,
//              email : req.body.email,
//              accountType : req.body.accountType,
//              password  : req.body.password
//           })

//          await newuser.save();
//          console.log("saved user" , newuser);
//          res.json({
//             message : "user saved"
//          })
         
//      }

//      catch(err)
//      {
//          console.log(err);
         
//      }
// })

// app.post("/api/login" , async(req , res) => {
     
// })




app.listen(8000 , () =>  {
       console.log("server listening to the port 8000");    
});

