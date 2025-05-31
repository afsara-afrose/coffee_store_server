const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("It a coffee Store")
});


app.listen(port, () => {
    console.log(`Coffee Store Running ${port}!`);
});



console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l0hikio.mongodb.net/NewCoffeeStore?retryWrites=true&w=majority&appName=Cluster0`;


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
        const coffeeCollection=client.db('NewCoffeeStore').collection('coffees')

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        //READ DATA

        app.get('/coffees',async(req,res)=>{
            const result=await coffeeCollection.find().toArray();
            res.send(result);
        })


        //Read view text

        app.get('/coffees/:id',async(req,res)=>{
            const id=req.params.id;
             const query={_id:new Object(id)}
            const result=await coffeeCollection.findOne(query);
            console.log(result);
        })

        //Update Data
        app.put('/coffee/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:new ObjectId(id)}
            const option={upsert:true};
            const updatedCoffee = req.body;
            const updatedDoc = {
                $set: updatedCoffee
            } 
        })

        app.delete("/coffees/:id",async(req,res)=>{
            const id=req.params.id;
            const query={_id:new Object(id)}
            const result=await coffeeCollection.deleteOne(query);
            console.log(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);
