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
const port =  5000;
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

app.use("https://bacola_backend.onrender.com/api", categoryRouter)
app.use('https://bacola_backend.onrender.com/api', subCategoryRouter)
app.use('https://bacola_backend.onrender.com/api', brandRouter)
app.use('https://bacola_backend.onrender.com/api', productRouter)
app.use('https://bacola_backend.onrender.com/api', userRouter)
app.use('https://bacola_backend.onrender.com/api', cartRouter)
app.use("https://bacola_backend.onrender.com/api", wishlistRouter)
app.use("https://bacola_backend.onrender.com/api",reviewRouter)