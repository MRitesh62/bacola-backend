import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    street: {
        type: String,
        default:null
    },
    city: {
        type: String,
        default:null
    },
    state: {
        type: String,
        default:null
    },
    pinCode: {
        type: Number,
        default:null
    },
    country: {
        type: String,
        default:null
    },
    phone: {
        type: Number,
        default:null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1
    }

});

export default mongoose.model('user',userSchema)