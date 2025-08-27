import multer from "multer";
import fs from 'fs';
import path from "path";
import productModel from "../model/product.model";
import {err} from '../error'
import categoryModel from "../model/category.model";
import sub_categoryModel from "../model/sub_category.model";
import brandModel from "../model/brand.model";
import { log } from "console";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("./assets/images")) {
            fs.mkdirSync('./assets/images');
        }
        cb(null, './assets/images')
    },
    filename: function (req, file, cb) {
        const ogName = file.originalname;
        const name = path.parse(ogName).name;
        const ext = path.parse(ogName).ext;
        const unique = Date.now();

        cb(null, name + "-" + unique + ext);
    }
});
const upload = multer({ storage: storage });

export const addProduct = async (req, res) => {
    try {
        const imgfiles = upload.fields([{ name: "images", maxCount: 3 }]);

        imgfiles(req, res, async function (err) {
            if (err) return err(res, 400, "Bad Request");
            const image = req.files["images"] ? req.files["images"].map((img) => img.filename) : [];

            const { name, category, sub_category, brand, rating, price, discount, availability, short_description, long_description, type, mfg, tags, life } = req.body;
            const create = await productModel.create({
                name: name,
                category: category,
                sub_category: sub_category,
                brand: brand,
                images: image,
                rating: rating != undefined ? Number(rating) : 0 || isNaN(Number(rating)) ? 0 : Number(rating),
                price: price != undefined ? Number(price) : 0 || isNaN(Number(rating)) ? 0 : Number(price),
                discount: discount != undefined ? Number(discount) : 0 || isNaN(Number(rating)) ? 0 : Number(discount),
                availability: availability,
                short_description: short_description,
                long_description: long_description,
                type: type,
                mfg: mfg,
                tags: tags,
                life: life
            });

            const categoryId = await categoryModel.findById(category);
            const sub_categoryId = await sub_categoryModel.findById(sub_category);
            const brandId = await brandModel.findById(brand);

            categoryId.product.push(create._id);
            await categoryId.save();

            if (sub_categoryId) {
                await sub_categoryModel.findByIdAndUpdate(
                    sub_category,               // The sub-category ID
                    { $push: { product: create._id } },  // Push the new product ID into the product array
                    { new: true }               // Return the updated document
                );
            }

            if (brandId) {
                brandId.products.push(create._id);
              await brandId.save();
            }
            console.log(create);
            

            return res.status(200).json({
                data: create,
                message: "Product Addded",
                success: true
            })
        })



    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const getProducts = async (req, res) => {
    try {

        const { limit, page, searchQuery:search, sort,categories } = req.query;
        // console.log(req.query);
        
        const skip = (page - 1) * limit;
        let filter = {}
        if  ((!search || search.trim() === "") && limit > 0) {
            const searchRgx = new RegExp(search, "i"); // Case insensitive search
            filter.$or = [
                { name: searchRgx },
                { tags: searchRgx },
            ];
        }
        if (categories) {
            const categoryArray = categories.split(",").map((cat) => cat.trim());
            filter.category = { $in: categoryArray };
        }
        else {
            filter = {}; // If no search query, return all products
        }
        // console.log('seatcg',search);
        
        let sortvalue = { _id: 1 };
        if (sort === 'new') {
            sortvalue = { _id: -1 };
        }
        if (sort === 'h2l') {
            sortvalue = { price: -1 }
        }
        if (sort === 'l2h') {
            sortvalue = { price: 1 }
        }
        // console.log("Limit:", limit, "Page:", page, "Search:", search);

// console.log(JSON.stringify(filter));

        const totalProducts = await productModel.countDocuments(filter);

        let query = productModel
            .find(filter)
            .populate("brand", "name")
            .populate("category", "category_name")
            .populate("sub_category")
            .sort(sortvalue);
            if (!search && limit>0) {
                query = query.limit(Number(limit)).skip(Number(skip));
            }
            
            const products = await query;
            
        return res.status(200).json({
            data: products,
            totalProducts,
            filepath: "http://localhost:8001/node-files/images/",
            message: 'All Products',
            success: true

        })

    } catch (error) {
        console.error(error)
        err(res, 500, "Internal Server Error")
    }
};

export const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel
            .findOne({ _id: id })
            .populate("brand", "name")
            .populate("category","category_name")
            .populate("sub_category")
        return res.status(200).json({
            data: product,
            filepath: "http://localhost:8001/node-files/images/",
            message: "Product",
            success: true
        })
    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
};

export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const imgfiles = upload.fields([{ name: "images", maxCount: 3 }]);

        imgfiles(req, res, async function (uploadErr) {
            if (uploadErr) return res.status(400).json({ message: "Bad Request", success: false });

            const new_img = req.files["images"] ? req.files["images"].map((img) => img.filename) : [];

            const { name, category, sub_category, brand, rating, price, discount, availability, short_description, long_description, type, mfg, tags, life } = req.body;

                const product = await productModel.findById(id);
            if (!product) return res.status(404).json({ message: "Product not found", success: false });

            if (new_img.length > 0) {
                product.images.forEach((img) => {
                    const filepath = path.join("./assets/images", img);
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                });
            }
            if (sub_category && sub_category !== product.sub_category?.toString()) {
                // Remove product from old sub-category
                if (product.sub_category) {
                    await sub_categoryModel.findByIdAndUpdate(product.sub_category, {
                        $pull: { product: product._id }
                    });
                }

                // Add product to new sub-category
                await sub_categoryModel.findByIdAndUpdate(sub_category, {
                    $addToSet: { product: product._id }
                });
            }
            if (category && category !== product.category?.toString()) {
                // Remove product from old sub-category
                if (product.category) {
                    await categoryModel.findByIdAndUpdate(product.category, {
                        $pull: { product: product._id }
                    });
                }

                // Add product to new sub-category
                await categoryModel.findByIdAndUpdate(category, {
                    $addToSet: { product: product._id }
                });
            }
            const updatedBrand = brand && brand !== "null" && brand.trim() !== "" ? brand : null;

            const updateData = {
                name,
                category,
                sub_category,
                brand: updatedBrand,
                rating,
                price,
                discount,
                availability,
                short_description,
                long_description,
                type,
                mfg,
                tags,
                life
            };

            if (new_img.length > 0) updateData.images = new_img;

            const updated = await productModel.updateOne({ _id: id }, { $set: updateData });

            if (updated.modifiedCount > 0) {
                return res.status(200).json({
                    message: "Product Updated",
                    success: true
                });
            }
            return err(res,400,"Bad Request");
            });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        for (const img of product.images){
        const filePath = path.resolve("./assets/images", img);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                // console.log(`Deleted: ${filePath}`);
            }
        };
        const deleted = await productModel.deleteOne({ _id: id });
        if (deleted.deletedCount > 0) {
            return res.status(200).json({
                message: "Product Deleted",
                success: true
            })
        }
        return err(res, 400, "Bad Request")


    } catch (error) {
        err(res, 500, "Internal Server Error")
    }
}