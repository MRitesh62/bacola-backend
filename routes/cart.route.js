import express from "express";
import { addCart, clearCart, getCart, removeProduct, updateCartQuantity } from "../controllers/cart.controller";
import { authorization } from "../middleware/authorization.middleware";

const router = express.Router();

router
    .post('/add-to-cart', authorization, addCart)
    .get('/get-cart', authorization, getCart)
    .put('/update-cart/:id',authorization,updateCartQuantity)
    .delete('/remove-product/:productId', authorization, removeProduct)
    .delete('/clear-cart',authorization,clearCart)

export default router;