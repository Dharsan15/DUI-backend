import express , {Request , response, Response} from "express";
import { userModel } from "../models/user.js";

 const  router = express.Router();


router.post("/signup" , async (req,res)   => {
    
     try{
          const user = await userModel.findOne({
              username : req.body.username
          })

          if(user)
          {
               res.status(400).json({
                   message : "user already exits"
               })
               return;
          }

            const newuser = new userModel(req.body);
            await newuser.save();
            res.status(200).json({
                message : "user saved"
            })
     }

     catch(err)
     {
          console.log(err);
          
           res.status(500).json("something went wrong");
     }
})

export default router;