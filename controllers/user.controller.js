import { err } from "../error";
import userModel from "../model/user.model";
import bcrypt from 'bcrypt';
export const addUser = async (req, res) => {
    try {
        const { userName,isAdmin, email, password, phone, street, city, state, pinCode, country } = req.body;
        const exist = await userModel.findOne({ email: email });
        if (exist) {
            return err(res,400,"User already exist")
        }
        const hashPassword = bcrypt.hashSync(password, 10);

        const user = await userModel.create({
            userName: userName,
            email: email,
            password: hashPassword,
            isAdmin:isAdmin,
            phone: phone,
            street: street,
            city: city,
            state: state,
            pinCode: pinCode,
            country: country
        })
        return res.status(200).json({
            data: user,
            message: "user added",
            success: true
        })
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({
            data: users,
            message: "All users",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};
export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findOne({ _id: id });
        return res.status(200).json({
            data: user,
            message: "User Data",
            success: true
        })
        
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { userName, email, phone, street, city, state, pinCode, country } = req.body;
        const updated = await userModel.updateOne({ _id: id }, {
            $set: {
                userName: userName,
                email: email,
                phone: phone,
                street: street,
                city: city,
                state: state,
                pinCode: pinCode,
                country: country
            }
        });
        if (updated.modifiedCount > 0) {
            return res.status(200).json({
                message: "User Data Updated",
                success: true
            })
        };
        return err(res, 400, "Bad Request")
    } catch (error) {
        err(res, 500, "Internal server Error")
    }
};

export const updatePwd = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return err(res, 400, "Email is required");

        const hashPassword = bcrypt.hashSync(password, 10);
        
        const updated = await userModel.updateOne({ email }, { $set: { password: hashPassword } });

        if (updated.modifiedCount > 0) {
            return res.status(200).json({
                message: "Password Updated",
                success: true
            });
        }
        return err(res, 400, "User not found or no changes made");
    } catch (error) {
        err(res, 500, "Internal Server Error");
    }
};



export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await userModel.deleteOne({ _id: id });
        if (deleted.deletedCount > 0) {
            return res.status(200).json({
                message: "User Deleted",
                success:true
            })
        };
        return err(res,400,"Bad Request")
    } catch (error) {
        err(res,500,"Internal Server Error")
    }
}