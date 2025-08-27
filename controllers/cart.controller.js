import cartModel from "../model/cart.model";
import productModel from "../model/product.model";
import { err } from "../error";

export const addCart = async (req, res) => {
    try {
        const { productId,quantity } = req.body;
        if (!productId || !quantity) {
            return err(res, 400, "Product ID and Quantity are required.")
        }
        
        const product = await productModel.findById(productId);
        if (!product) {
            return err(res, 404, "Product not found")
        }

        const userId = req.user._id;
        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({ user: userId, products: [] });
        }
        if (!Array.isArray(cart.products)) {
            cart.products = [];
        }
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
            cart.products[productIndex].price = product.price;
        }
        else {
            cart.products.push({
                productId, quantity, price: product.price
            });
        }

        // Total price

        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await cart.save();

        return res.status(200).json({
            data: cart,
            message: "Product added to cart"
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const getCart = async (req, res) => {
    try {
        // console.log(req.user);
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const id = req.user._id;
        const data = await cartModel.findOne({ user: id }).populate("products.productId");
        if (!data) {
            return res.status(200).json({
                data: { products: [], totalPrice: 0 },
                message: "Cart is empty",
                success: true
            });
        }
        return res.status(200).json({
            data: data,
            message: "cart data",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};
export const updateCartQuantity = async (req, res) => {
    try {
        const { id } = req.params; // productId
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const userId = req.user._id;
        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === id);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.products[productIndex].quantity = quantity;

        // Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        await cart.save();

        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params; // Use req.params instead of req.body for DELETE request
        const user = req.user._id;

        let cart = await cartModel.findOne({ user });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productExists = cart.products.some(item => item.productId.toString() === productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the product from cart
        cart.products = cart.products.filter(item => item.productId.toString() !== productId);

        // Recalculate total quantity and price
        cart.quantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        return res.status(200).json({
            data: cart,
            message: "Product has been removed from the cart."
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user = req.user._id;
        const cart = await cartModel.findOneAndDelete({ user: user });
        return res.status(200).json({
            message: "cart removed",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};