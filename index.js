const express = require('express')
const { MongoClient } = require('mongodb');       
 const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express()
const port =  process.env.PORT || 5000


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6dke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected');
        const database = client.db('tripAdvisor');
        const serviceCollection = database.collection('services');
        
        const orderCollection  = database.collection('orders');
        const hotelCollection = database.collection('hotels');
        const nextTripCollection = database.collection('nextTrip')
        /* const usersCollection = database.collection('users') */
       /*  console.log(orderCollection); */
        // POST API 
      /*   app.post('/services', async(req,res) => {
          console.log('hitting the post', req.body);
            res.send('hit the post')
        })
         */

        // GET services API 
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // Get orders by email API
        app.get('/orders', async(req, res) => {
             const email = req.query.email;
             const query = {email : email};
             console.log(query)  
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

           // GET orders API 
           app.get('/order', async(req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            console.log(orders);
            res.send(orders);
        });  
         

           //  GET Single order
       app.get('/orders/:_id', async(req, res) =>{
        const id = req.params._id;
        console.log('getting specific order', id)
        const query = {_id: ObjectId(id)};
        const sigleOrder = await  orderCollection.findOne(query)
        res.json(sigleOrder);

   }) 
   

        // GET Hotels api
        app.get('/hotels', async(req, res) => {
          const cursor = hotelCollection.find({});
          const hotels = await cursor.toArray();
          res.send(hotels);
      });
        // GET NextTrip api
        app.get('/nextTrip', async(req, res) => {
          const cursor = nextTripCollection.find({});
          const nextTrips = await cursor.toArray();
          res.send(nextTrips);
      });


     
         // Use POST to get data by _ids
          app.post('/services/byids', async (req, res) => {
             console.log(req.body);
          const _ids = req.body;
          const query = { _id: { $in: _ids} }
          const products = await productCollection.find(query).toArray();
          res.json(products);
      });  

          // Add Orders API 
          app.post('/orders', async(req,res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send('Order processed');
        })


         
        // POST API
        app.post('/services', async (req,res) => {
           
          const service = req.body;
        console.log('hit the post api',service);
        
        const result = await serviceCollection.insertOne(service);
         console.log(result);
          res.send(result)
        })
       
        // DELETE API
        app.delete('/orders/:_id', async(req,res) =>{
          const id = req.params._id;
          const query = {_id:ObjectId(id)};
          const result = await orderCollection.deleteOne(query);
          res.json(result);
  
        })
        
       


    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})