import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_name: {
        type: String,
        required:true
    },
    sub_category:[ { 
        type: Schema.Types.ObjectId,
        ref: 'sub_category',
        default:null
    }],
    product: [{
        type: Schema.Types.ObjectId,
        ref:'product'
    }],
    createdAt: {
        type: Date,
        default:Date.now()
    },
    status: {
        type: Number,
        default:1
    }
})

export default mongoose.model("category",categorySchema)