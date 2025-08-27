import wishlistModel from "../model/wishlist.model";
import { err } from "../error";

export const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user._id;
        let wishlist = await wishlistModel.findOne({ user: user });
        
        if (!wishlist) {
            wishlist = new wishlistModel({ user: user, products: [] });
        }
        const exist = wishlist.products.find(item => item.productId.toString() === productId);
        if (exist) {
            return err(res, 400, "Product already exist.")
        }
        wishlist.products.push({ productId });
        await wishlist.save();

        return res.status(200).json({
            data: wishlist,
            message: "Product added to wishlist",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const getWishlist = async (req, res) => {
    try {
        const user = req.user._id;
        const wishlist = await wishlistModel.findOne({ user: user }).populate("products.productId");
        return res.status(200).json({
            data: wishlist,
            message: "Wishlist",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user._id;
        
        const wishlist = await wishlistModel.findOne({ user });

        wishlist.products = wishlist.products.filter(item => item.productId.toString() !== productId);
        await wishlist.save();

        return res.status(200).json({
            message: "Product removed from wishlist.",
            success:true
        })
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
};

export const clearWishlist = async (req, res) => {
    try {
        const user = req.user._id;

        const wishlist = await wishlistModel.findOneAndDelete({ user: user });

        return res.status(200).json({
            message: "Wishlist Cleared",
            success:true
        })
    } catch (error) {
        err(res,500,"Internal Server Error")
    }
}