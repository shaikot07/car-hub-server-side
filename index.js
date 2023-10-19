const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middlewer
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.loifkbc.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const cartCollection = client.db('productDB').collection('cart');



    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // step:1 
    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    // step: 3 

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result)
    })
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          image: updateProduct.image,
          name: updateProduct.name,
          brandName: updateProduct.brandName,
          type: updateProduct.type,
          price: updateProduct.price,
          shortDescription: updateProduct.shortDescription,
          rating: updateProduct.rating
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })

    app.post('/cart', async (req, res) => {
      const addToCart = req.body;
      console.log(addToCart);
      const result = await cartCollection.insertOne(addToCart);
      res.send(result);
    })


    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })


    app.delete('/cart/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id); //id value is oky 
      const query = {_id: new ObjectId(id) };
      const result = cartCollection.deleteOne(query);
      console.log(result);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('simple CRUD is RUNNING')
})

app.listen(port, () => {
  console.log(`simple CRUD is running on port,${port}`);
})

