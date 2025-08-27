import reviewModel from "../model/review.model";
import { err } from "../error";

export const addreview = async (req, res) => {
    try {
        const { productId,userId, rating, comment } = req.body;
        // const userId = req.params.id;

        const review = new reviewModel({ productId, userId, rating, comment });
        await review.save();

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
};


export const getReview = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await reviewModel.find({ productId:id}).populate("userId", "userName");
        // console.log(reviews)
        res.status(200).json({
            
            data: reviews,
            message:'success'
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error fetching reviews" });
    }
}