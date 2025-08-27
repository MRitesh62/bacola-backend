import categoryModel from "../model/category.model";
import mongoose from "mongoose";
import {err} from '../error'

export const addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const existingCategory = await categoryModel.findOne({ category_name: category_name });
        if (existingCategory) {
            return err(res,400,"Category already exist.")
        }
        const create = await categoryModel.create({ category_name: category_name });
        // console.log(create);
        
        return res.status(200).json({
            data: create,
            message: "Category Inserted Successfully.",
            success:true
        })
    } catch (error) {
        console.error(error)
        err(res,500,"Inernal Server Error.")
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find()
            .populate("sub_category")
            .populate('product')
        return res.status(200).json({
            filepath: "http://localhost:8001/node-files/images/",
            data: categories,
            message: "All Categories.",
            success: true
        })
        
    } catch (error) {
        err(res, 500, "Internal Server Error.")
    }
};

export const getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
              success: false,
              message: "Invalid Category ID format",
            });
          }
        const category = await categoryModel.findOne({ _id: id }).populate('sub_category').populate("product");
        if (!category) {
            return err(res, 400, "No Category Found.");
        }
        return res.status(200).json({
            data: category,
            filepath: "http://localhost:8001/node-files/images/",
            message: "Category",
            success: true
        })
        
    } catch (error) {
        // console.error(error);
        
        err(res, 500, "Internal Server Error")
    }
};

export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { category_name } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Category ID format",
            });
        }
        const updatedData = await categoryModel.updateOne({ _id: id }, {
            $set: {
                category_name: category_name
            }
        })

        if (updatedData.modifiedCount > 0) {
            return res.status(200).json({
                message: "Category Updated Successfully.",
                success: true
            })
        }
        return err(res, 400, "Bad Request");

    } catch (error) {
        err(res, 500, "Internal Server Error.");
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return err(res,400,"Invalid Category ID format")
        }
        const deleted = await categoryModel.deleteOne({ _id: id });
        if (deleted.deletedCount > 0) {
            return res.status(200).json({
                message: "Category Deleted ",
                success: true
            })
        }
        return err(res, 400, "Bad Request");
    } catch (error) {
        err(res, 500, "Internal Server Error.")
    }
};