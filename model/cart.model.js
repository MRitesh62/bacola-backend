import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartSchema = new Schema({
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
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            min: 1,
            default:1
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

export default mongoose.model("cart",cartSchema)