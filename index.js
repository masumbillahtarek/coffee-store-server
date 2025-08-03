const express=require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors=require('cors')
const app=express()
const port=process.env.PORT||5000
app.use(cors())
app.use(express.json())
//password: qBMiToCQsw27YpWV
//UserName : coffeeMaster
console.log(process.env.DB_USER,process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0h4513.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database=client.db('userDB');
    const userCollection=database.collection('users')
       const userDataCollection=database.collection('usersData')
    app.get('/coffees',async(req,res)=>{
      const cursor=userCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/coffees/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await userCollection.findOne(query)
      res.send(result)
    })
    //For User Data Start
        app.get('/users',async(req,res)=>{
      const cursor=userDataCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
        app.get('/users/:id',async(req,res)=>{
     const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await userDataCollection.findOne(query)
      res.send(result)
    })
  app.post('/users',async(req,res)=>{
      const user=req.body
      const result=await userDataCollection.insertOne(user)
      res.send(result)
    })
    app.patch('/users',async(req,res)=>{
      const user=req.body
      const email={email:user.email}
      const updatedUserData={
        $set:{
          lastLoggedAt:user.lastLoggedAt
        }
      }
      const result=await userDataCollection.updateOne(email,updatedUserData)
    })
     app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id
       const query={_id:new ObjectId(id)}
      const result=await userDataCollection.deleteOne(query)
      res.send(result)
    }) 
    //end
    app.post('/coffees',async(req,res)=>{
      const coffee=req.body
      const result=await userCollection.insertOne(coffee)
      res.send(result)
    })
    app.put('/coffees/:id',async(req,res)=>{
       const id=req.params.id
       const query={_id:new ObjectId(id)}
       const coffee=req.body
       const options={upsert:true}
       const updatedCoffee={
        $set:{
          name:coffee.name,
          chef:coffee.chef,
          supplier:coffee.supplier,
          taste:coffee.taste,
          category:coffee.category,
          details:coffee.details,
          photo:coffee.photo
        }
       }
       const result=await userCollection.updateOne(query,updatedCoffee,options)
       res.send(result)
    })
    app.delete('/coffees/:id',async(req,res)=>{
      const id=req.params.id
       const query={_id:new ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      res.send(result)
    }) 
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Get Ready')
})
app.listen(port,()=>{
    console.log('its ok')
})