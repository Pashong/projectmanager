import jwt, { JwtPayload } from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies.token;

    if(!token){
      return res.status(401).json({message: "Not authenticated!"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        req.user = decoded as JwtPayload;

        next();
    }
    catch(error){
        return res.status(401).json({message: 'Invalid token'});
    }
}