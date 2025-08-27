import brandModel from "../model/brand.model";
import { err } from "../error";
import productModel from "../model/product.model";

export const addBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const create = await brandModel.create({ name: name });
        return res.status(200).json({
            data: create,
            message: "brand Added",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error.")
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await brandModel.find().populate("products");
        return res.status(200).json({
            data: brands,
            message: "All Brands",
            success: true
        })
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
};

export const getBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await brandModel.findOne({ _id: id }).populate("products")
        return res.status(200).json({
            data: brand,
            message: "Brand",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const updateBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        const updated = await brandModel.updateOne({ _id: id }, {
            $set: {
                name: name
            }
        })
        if (updated.modifiedCount > 0) {
            return res.status(200).json({
                message: "Brand Updated",
                success: true
            })
        }
        return err(res, 400, "Bad Request")
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await brandModel.deleteOne({ _id: id });
        if (deleted.deletedCount > 0) {
            return res.status(200).json({
                message: "Brand Deleted",
                success: true
            })
        }
        return err(res, 400, "Bad Request")
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};
