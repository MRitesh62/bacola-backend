import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewModel = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("review",reviewModel)