import express from 'express';
import { addSub_category, deleteSub_category, getSub_categories, getSub_category, updateSub_category } from '../controllers/sub_category.controller';
import { admin, authorization } from '../middleware/authorization.middleware';

const router = express.Router();

router
    .post('/add-sub_category',authorization,admin, addSub_category)
    .get('/get-sub_categories', getSub_categories)
    .get('/get-sub_category/:id', getSub_category)
    .put('/update-sub_category/:id',authorization,admin,  updateSub_category)
    .delete('/delete-sub_category/:id',authorization,admin,  deleteSub_category)

export default router;