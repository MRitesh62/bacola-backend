import express from 'express';
import { addreview, getReview } from '../controllers/review.controller';
import { authorization } from '../middleware/authorization.middleware';

const router = express.Router();

router.post('/add-review', authorization, addreview)
    .get('/get-review/:id', getReview)

export default router;