import express , {Request ,  Response} from "express";
import { userModel } from "../models/user.js";
import  jwt  from "jsonwebtoken";
import "dotenv/config";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import verifyToken from "../middleware/auth.js";

 const  router = express.Router();


router.get("/me", verifyToken ,  async (req , res)=> {

    const username = req.username;

    res.status(200).json({
        username : username
    })

})

router.post("/signup" , [
    check("username" , "username is require").isString(),
    check("email" , "email is required").isEmail(),
    check("accountType" , "accountType must be selected").isString(),
    check("password" , "password atleast must be 6 characters").isString().isLength({min : 6})

] ,async (req : Request  ,res : Response)   => {

    const error = validationResult(req);
    console.log("login request came");


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
            

            const token = jwt.sign({username : newuser.username , email : newuser.email} , process.env.JWT_SECRET_KEY as string , {
                expiresIn: "1d",
              });

            res.cookie("authtoken" , token ,  {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

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
] , async (req : Request , res : Response) => {

    console.log("login request came");
    
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
    
        if(!user)
        {
             res.status(400).json({
                message : "Invalid credentials"
             })
        }
    
        const isPassMatch = await bcrypt.compare(req.body.password , user!.password );
    
         if(!isPassMatch)
            {
              res.status(400).json({
                message : "invalid credentials"
             })     
            }

          const token = jwt.sign({ username : user?.username , email : user?.email} , process.env.JWT_SECRET_KEY as string , {
            expiresIn: "1d",
          }); 
          res.cookie("authtoken" , token ,  { 
             httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });

        //   res.cookie("authtoken" , token ,  { maxAge : 24 * 60 * 60 * 1000});
          res.status(200).json({
              userId : user?._id,
              username : user?.username
          })  
    }

     catch(error)
     {
        console.log(error); 
         res.status(500).json({
             message : "something went wrong"
         })
     }


    
})

export default router;