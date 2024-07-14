const express = require('express');
const app = express();
const Product = require('./modules/produtos');
require("dotenv").config()

const mongoose = require('mongoose');
const cors = require('cors');

const port = 3000;
const MONGO_URI = process.env.MONGO_URI

const path = require('path');
const basePath = path.join(__dirname, '.');


mongoose.connect(MONGO_URI)
    .then(()=> console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


// Routes

// Devolver todos os produtos

app.get('/products/view', (req, res) => {
    res.sendFile(`${basePath}/templates/product_list.html`);
});

app.get('/products/list', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
    });


// Devolver a média de rating de todos os produtos
app.get('/products/average-rating', async (req, res) => {
    const averageRating = await Product.aggregate([
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    res.json(averageRating[0].averageRating);
    });

// Devolver todos os produtos cujo preço seja maior que um determinado valor
app.get('/products/price-gt/:price', async (req, res) => {
    const products = await Product.find({ price: { $gt: req.params.price } });
    res.json(products);
    });

// Devolver todos os produtos que tenham uma determinada marca e cujo preço seja superior a X
app.get('/products/brand/:brand/price-gt/:price', async (req, res) => {
    const products = await Product.find({
        brand: req.params.brand,
        price: { $gt: req.params.price }
    });
    res.json(products);
    });


// Devolver todos os produtos de uma determinada marca
app.get('/products/brand/:brand', async (req, res) => {
    const products = await Product.find({ brand: req.params.brand });
    res.json(products);
    });

// Devolver todos os produtos ordenados por rating
app.get('/products/rating-desc', async (req, res) => {
    const products = await Product.find({})
        .sort({ rating: -1 })
        .exec();
    res.json(products);
    });

// Devolver todos os produtos que tenham imagens
app.get('/products/with-images', async (req, res) => {
    const products = await Product.find({ 'pictures.0': { $exists: true } });
    res.json(products);
    });


// Remover um produto pelo ID
app.delete('/products/delete/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    .then(result => {
        res.json({
            'success': 1,
            'message': 'Product deleted!'
        })
    })
    .catch(err => {
        console.error(err);
    });
    });

// Adicionar um produto
app.get('/products/add', (req, res) => {
    res.sendFile(`${basePath}/templates/product_add.html`);
});

app.post('/products/add', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
    });

// Devolver os dados de um produto específico

app.get('/products/search/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
    });

// Atualizar um produto
app.patch('/products/update/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.json(product);
    });


app.get('/', (req, res) => {
    res.send('Home page');
    });


app.get('/about', (req, res) => {
    res.send('About page');
    });

/*
*/

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`);
});
