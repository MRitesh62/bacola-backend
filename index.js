import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import categoryRouter from './routes/category.route';
import subCategoryRouter from './routes/sub_category.route';
import brandRouter from "./routes/brand.route";
import productRouter from './routes/product.route';
import userRouter from './routes/user.route';
import cartRouter from './routes/cart.route';
import wishlistRouter from "./routes/wishlist.route";
import reviewRouter from './routes/review.route';
const app = express();
app.use(cors())
app.use(express.json());
const port = 8001 || 5000;
app.use('/node-files',express.static('assets'))
mongoose
    .connect("mongodb+srv://ritesh:<db_password>@cluster0.jywrqfc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("Connected")
    )
.catch((error)=>console.log(error)
)


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})

app.use("/api", categoryRouter)
app.use('/api', subCategoryRouter)
app.use('/api', brandRouter)
app.use('/api', productRouter)
app.use('/api', userRouter)
app.use('/api', cartRouter)
app.use("/api", wishlistRouter)
app.use("/api",reviewRouter)