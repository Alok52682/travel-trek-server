const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w2hsrgs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('travelTrackDB').collection('services');

        app.get('/services', async (req, res) => {
            const query = {};
            const size = parseInt(req.query.size);
            const cursor = serviceCollection.find(query);
            if (size) {
                const services = await cursor.limit(size).toArray();
                res.send(services);
            }
            else {
                const services = await cursor.toArray();
                res.send(services);
            }

        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
    }
    catch {

    }
    finally {

    }
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Travel Track server is running!!');
});

app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
})