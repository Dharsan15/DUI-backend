import { NextFunction , Request , Response } from "express";
import jwt , {JwtPayload } from "jsonwebtoken"


declare global {
    namespace Express {
      interface Request {
        username : string;
      }
    }
  }


const verifyToken = (req : Request , res : Response, next : NextFunction) => {

    const token = req.cookies['authtoken'];

    console.log(token);
    

    if(!token)
    {
         res.status(401).json({
            message : "unauthorized user da"
         })

         return;
    }

   try
   {
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY as string);

        req.username  = (decoded as JwtPayload).username;

        next();
   }
   catch(error)
   {
        res.status(401).json({
             message : "unauthorized user"
        })
   }

}


export default verifyToken;
