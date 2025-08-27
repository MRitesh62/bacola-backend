import mongoose from "mongoose";

const Schema = mongoose.Schema;

const brandModel = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "product"
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 1
    }

});
export default mongoose.model('brand',brandModel)