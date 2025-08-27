import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productModel = new Schema({
    name: {
        type: String,
        required:true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:'category'
    },
    sub_category: {
        type: Schema.Types.ObjectId,
        ref: 'sub_category',
        default:null
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
        default:null,
        required:false
    },
    images: {
        type: Array,
        default:[]
    },
    rating: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
        
    },
    discount: {
        type: Number,
        default: 0,
        
    },
    availability: {
        type: String,
        default:null
    },
    short_description: {
        type: String,
        default:null
    },
    long_description: {
        type: String,
        default:null
    },
    type: {
        type: String,
        default:null
    },
    mfg: {
        type: String,
        default:null
    },
    life: {
        type: String,
        default:null
    },
    tags: {
        type: String,
        default:null
    },
    filepath: {
        type: String,
        default: "http://localhost:8001/node-files/images/"
    },
    
})

export default mongoose.model("product",productModel)