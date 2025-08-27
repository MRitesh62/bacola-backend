import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from "../model/user.model";
import { err } from '../error';
export const signup = async (req, res) => {
    try {
        const { userName, email, password, phone, street, city, state, pinCode, country } = req.body;
        const existUser = await userModel.findOne({ email: email });
        if (existUser) {
            return err(res, 400, "User already exist")
        };

        const hashPassword = bcrypt.hashSync(password, 10);

        const userData = await userModel.create({
            userName: userName,
            email: email,
            password: hashPassword,
            phone: phone,
            street: street,
            city: city,
            state: state,
            pinCode: pinCode,
            country: country
        });
        return res.status(200).json({
            data: userData,
            message: "SignUp Successfully",
            success: true
        })

        
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
};

export const login = async (req, res) => {
   try {
    const { email, password } = req.body;
    const existUser = await userModel.findOne({ email: email });
       if (!existUser) {
        
        return err(res,400,"No user found ")
    };
    const matchpwd = bcrypt.compareSync(password, existUser.password);
    if (!matchpwd) {
        return err(res,400,"Invaild Credential")
    };
    const userData = await userModel.findOne({ email: email }).select('-password');
    const token = jwt.sign(
        { id: userData._id },
        "mykey",
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        data: userData,
        token: token,
        message: "Login Successfully",
        success:true
    })
    

   } catch (error) {
       console.error(error)
    err(res,500,"Internal Server Error")
   }
}