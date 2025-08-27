
import express from 'express';
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller';
import { admin, authorization } from '../middleware/authorization.middleware';

const router = express.Router();

router
    .post('/add-category',authorization,admin, addCategory)
    .get('/get-categories', getCategories)
    .get('/get-category/:id', getCategory)
    .put('/update-category/:id',authorization,admin, updateCategory)
    .delete('/delete-category/:id',authorization,admin,deleteCategory)


export default router;