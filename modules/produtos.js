const mongoose = require('mongoose');




const specsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    optionDescription: String
});

const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        price: { type: Number, required: true },   
        model: { type: String, required: true },   
        brand: { type: String, required: true },   
        pictures: { type: [String] },   
        specs: [specsSchema],  
        rating: { type: Number }, 
        timestamps: {
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        }
});

const Product = mongoose.model("Product",productSchema);
module.exports = Product;
 