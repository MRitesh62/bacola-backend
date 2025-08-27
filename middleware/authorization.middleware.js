import userModel from "../model/user.model";
import jwt from "jsonwebtoken";
import { err } from "../error";
export const authorization = async (req, res, next) => {
    try {
        
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "mykey");
            // console.log(decoded);

            const userData = await userModel.findOne({ _id: decoded.id });
            req.user = userData;
            if (decoded) {
               return next()
            }
            else {
                return err(res, 401, "Invalid Token")
            }
        }
        else {
            err(res, 401, "Please login !")
        }

    } catch (error) {
        console.error(error)
        return err(res, 500, "Internal Server Error")
    }
};

export const admin = (req, res, next) => {
    try {
        if (req.user.isAdmin) {
            return next();
        }
        return err(res, 403, "You don't have an admin access");
    } catch (error) {
        console.error(error)
        err(res,500,"Internal Server Error")
    }
}