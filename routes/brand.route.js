import express from 'express';
import { addBrand, deleteBrand, getBrand, getBrands, updateBrand } from '../controllers/brand.controller';
import { admin, authorization } from '../middleware/authorization.middleware';

const router = express.Router();

router
    .post('/add-brand',authorization,admin, addBrand)
    .get('/get-brands', getBrands)
    .get('/get-brand/:id', getBrand)
    .put('/update-brand/:id',authorization,admin,  updateBrand)
    .delete('/delete-brand/:id',authorization,admin,  deleteBrand)

export default router;
