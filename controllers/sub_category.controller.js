import mongoose from "mongoose";
import sub_categoryModel from "../model/sub_category.model";
import { err } from "../error";
import categoryModel from "../model/category.model";

export const addSub_category = async (req, res) => {
    try {
        const { category_name,main_category,product } = req.body;
        const exist = await sub_categoryModel.findOne({ category_name: category_name });
        if (exist) {
            return err(res, 400, "Category Already Exist.");
        }
        const create = await sub_categoryModel.create({ category_name: category_name,main_category:main_category,product:product });

        const main = await categoryModel.findById(main_category);
        // console.log(main);
        
        if (!main) {
            return err(res, 404, "Category not found");
        }
        main.sub_category.push(create._id);
        await main.save();
        return res.status(200).json({
            data: create,
            message: 'Category Inserted Successfully.',
            success: true
        })
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error");
    }
};

export const getSub_categories = async (req, res) => {
    try {
        const { main_category } = req.query;
        let query = {};

        // Filter sub-categories if main_category is provided
        if (main_category) {
            query.main_category = main_category;
        }

        const categories = await sub_categoryModel.find(query).populate('main_category','category_name').populate('product');
        return res.status(200).json({
            data: categories,
            filepath: "http://localhost:8001/node-files/images/",
            message:'All Categories',
            success:true
        })
    } catch (error) {
        err(res, 500, 'Internal Server Error');
    }
}

export const getSub_category = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return err(res, 400, "Invalid Category Id.")
        }
        const category = await sub_categoryModel.findOne({ _id: id }).populate('main_category','category_name').populate('product');;
        return res.status(200).json({
            filepath: "http://localhost:8001/node-files/images/",
            data: category,
            message: 'Category Data',
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error");
    }
};

export const updateSub_category = async (req, res) => {
    try {
        const id = req.params.id;
        const { category_name: category_name } = req.body;
        const updated = await sub_categoryModel.updateOne({ _id: id }, {
            $set: {
                category_name: category_name
            }
        })
        if (updated.modifiedCount > 0) {
            return res.status(200).json({
                message: "Category Updated"
            })
        }
        return err(res, 400, "Bad Request")
        
    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error");
    }
};


export const deleteSub_category = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await sub_categoryModel.deleteOne({ _id: id });
        if (deleted.deletedCount > 0) {
            return res.status(200).json({
                message: "Category Deleted",
                success: true
            })
        }
        return err(res, 400, "Bad Request")
    } catch (error) {
        err(res, 500, "Internal Server Error");
    }
}
