import express , {Request ,  Response} from "express";
import { userModel } from "../models/user.js";
import  jwt  from "jsonwebtoken";
import "dotenv/config";
import { check, validationResult } from "express-validator";

 const  router = express.Router();


router.post("/signup" , [
    check("username" , "username is require").isString(),
    check("email" , "email is required").isEmail(),
    check("accountType" , "accountType must be selected").isString(),
    check("password" , "password atleast must be 6 characters").isString().isLength({min : 6})

] ,async (req : Request  ,res : Response)   => {

    const error = validationResult(req);

    if(!error.isEmpty())
    {
        res.status(400).json({
            message : error.array()
        })
        return;
    }
    
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

            console.log(newuser);
            

            const token = jwt.sign({username : newuser.username} , process.env.JWT_SECRET_KEY as string);

            res.cookie("authtoken" , token);

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

router.post("/login" , [
    check("username" , "user must be required").isString(),
    check("password" , "password must be required").isString().isLength({min : 6})
] , async (req , res) => {
     try{
         
     }
     catch(err)
     {

     }
})

export default router;