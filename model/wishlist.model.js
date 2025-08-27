import mongoose from "mongoose";

const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }

    }]
});
export default mongoose.model("wishlist", wishlistSchema);