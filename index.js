const  express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.port || 5000;

//midleware
app.use(cors())
app.use(express.json());



//pass:YOY67ubhncV4yhq9


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.bsfuvd2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
     try{
          const userCollection = client.db('simplemongo').collection('users');

          app.get('/users', async(req, res) =>{
               const query = {}
               const cursor = userCollection.find(query);
               const users = await cursor.toArray();
               res.send(users)

          })

       app.post('/users', async(req, res) =>{
          const user = req.body;
          const result = await userCollection.insertOne(user)
          res.send(result)
       })

       app.put('/users/:id', async(req, res) =>{
        const id = req.params.id
        const filter = {_id: ObjectId(id)}
        const user = req.body
        const option = {upsert: true};
        const updatedUser = {
           $set: {
               name: user.name,
               addrs: user.addrs,
               email: user.email
           }
        }
          const result = await userCollection.updateOne(filter,updatedUser,option, )
          res.send(result)
       })

       app.get('/users/:id', async(req, res) =>{
          const id = req.params.id
          const query = {_id: ObjectId(id)}
          const user = await userCollection.findOne(query)
          res.send(user)
       })

       app.delete('/users/:id', async(req, res) =>{
          const id = req.params.id 
          const query = {_id : ObjectId(id)}
          const result = await userCollection.deleteOne(query)
          console.log(result)
          res.send(result)
       })
     }
     finally{

     }
}

run().catch(err => console.log(err))



app.get('/', (req, res) =>{
     console.log('mongo server is ranning')
})



app.listen(port,()=>{
     console.log(`Listaning to port${port}`)
})





