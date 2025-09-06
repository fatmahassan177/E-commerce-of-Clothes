const mongoose =require('mongoose')
const connectDB = async()=>{           

try{const conn =await mongoose.connect((process.env.MONGO_URL))
console.log('database connected')
}
   catch(err){
    console.log(`database connection error ${err.message}`);
    process.exit(1);

}
}
module.exports=connectDB