const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongooseDB
mongoose.connect("mongodb+srv://Boopathy:BoopathyLOVE@cluster0.wmnmii2.mongodb.net/E-Commerce");

// API creation

app.get("/",(req,res)=>{
    res.send("Express app is running")
})

// Image storage engine

const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage: storage})

// Creating Uploads Endpoint for image
app.use('./images',express.static('uploads/images'))

app.post("/uploads",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url: `http://loaclhost:${port}/images/${req.file.filename}`
    })
})


// Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{type:Number,required:true},
    name:{type:String,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
    new_price:{type:Number,required:true},
    old_price:{type:Number,required:true},
    date:{type:Date,default:Date.now},
    available:{type:Boolean,default:true},
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if (products.lenght>0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id_inc = last_product.id+1;
    }
    const product = new Product({
        id:id_inc,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})


// Creating api for deleting producct
app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name
    })
})


app.listen(port,(error)=>{
    if (!error) {
        console.log("Server running on port"+port);
    }else{
        console.log("Erroe"+error);
    }
})