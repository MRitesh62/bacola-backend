import express from 'express';
import { addWishlist, clearWishlist, getWishlist, removeWishlist } from '../controllers/wishlist.controller';
import { authorization } from "../middleware/authorization.middleware";

const router = express.Router();

router
    .post('/add-wishlist',authorization, addWishlist)
    .get('/get-wishlist',authorization, getWishlist)
    .delete('/remove-wishlist/:productId',authorization, removeWishlist)
    .delete('/clear-wishlist',authorization, clearWishlist)
export default router;