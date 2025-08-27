import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sub_categoryModel = new Schema({
    category_name: {
        type: String,
        required:true
    },
    main_category: {
            type: Schema.Types.ObjectId,
            ref:'category'
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: "product",
        default:[]
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default:1
    }

})

export default mongoose.model("sub_category", sub_categoryModel);