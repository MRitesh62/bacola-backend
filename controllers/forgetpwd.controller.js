import nodemailer from 'nodemailer';
import userModel from "../model/user.model";
import { err } from "../error";

const transport = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    auth: {
        user: 'letstechwithweb@gmail.com',
        pass: 'juvn xfvi jvky jjlr',
    },
});

const sendEmail = async (to, subject, msg) => {
    try {
        await transport.sendMail({
            to: to,
            subject: subject,
            text: msg
        });
        // console.log('Email sent successfully!');
    } catch (error) {
        // err(res, 500, "Internal Server Error !")
        console.error("Error sending email:", error);
        return false;
    }
};
// sendEmail();

export const forget = async (req, res) => {
    try {
        const { email } = req.body;

        const exist = await userModel.findOne({ email: email });
        if (!exist) {
            return err(res, 404, "No user found")
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // console.log(otp);
        await sendEmail(email, "generating otp", `your otp is ${otp}`)
        return res.status(200).json({
            otp:otp,
            message: "Opt has been sent to your registered email address",
            success:true
        })

    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
}
export const orderSuccess = async (req, res) => {
    try {
        const { email, total, paymentMethod } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return err(res, 404, "User not found");
        }

        const message = `Dear user,\n\nYour order has been successfully placed.\n\nTotal Amount: $${total}\nPayment Method: ${paymentMethod}\n\nThank you for shopping with us!\n\nBest Regards,\nBacola`;
        
        await sendEmail(user.email, "Order Confirmation", message);

        return res.status(200).json({
            message: "Order confirmation email sent successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        err(res, 500, "Internal Server Error");
    }
};