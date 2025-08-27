import express from 'express';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller';
import { admin, authorization } from '../middleware/authorization.middleware';

const router = express.Router();

router
    .post('/add-product',authorization,admin, addProduct)
    .get('/get-products', getProducts)
    .get('/get-product/:id', getProduct)
    .put('/update-product/:id',authorization,admin,  updateProduct)
    .delete('/delete-product/:id',authorization,admin, deleteProduct)
    

export default router;