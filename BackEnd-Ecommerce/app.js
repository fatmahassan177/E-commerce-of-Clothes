const cors =require('cors')
const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./Middlewares/cors.middleware');
const path = require('path');
dotenv.config();
const connectDB = require('./Config/configDB');

const app = express();
 app.use(corsMiddleware); 


connectDB();


app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use(express.json()); 



// Routes
app.use('/api/user', require('./Routes/User.route'));
app.use('/api/product', require('./Routes/Product.route'));
app.use('/api/category', require('./Routes/Category.route'));
app.use('/api/contact', require('./Routes/Contact.route'))
app.use('/api/FAQ', require('./Routes/FAQ.route'))
app.use('/api/Testimonial', require('./Routes/Testimonial.route'))
app.use('/api/Cart', require('./Routes/Cart.route'))
app.use('/api/Order', require('./Routes/Order.route'))


const AppError=require('./utils/app-error.utils')
const globalErrorHandling=require('./Middlewares/Erorr-handelar.middleware')
app.use((req,res,next )=>{
    next(new AppError(`cant find ${req.originalUrl} on this server`))
})
app.use(globalErrorHandling)
app.listen(process.env.PORT, () => console.log(`Server started at port ${process.env.PORT}`));




