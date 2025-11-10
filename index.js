const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Habit tracker is Running");
});

const uri =
  "mongodb+srv://habit-tracker-db:zCNlsBQlJIifbJwj@cluster0.kyh1mx2.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("habit-track-db");
    const habitsCollection = db.collection("habits");
    //! all data find
    app.get("/habits", async (req, res) => {
      const result = await habitsCollection.find().toArray();

      res.send(result);
    });

    //! --------------------------------------
    //! Home fetures data find
    app.get("/fetured", async (req, res) => {
      try {
        const result = await habitsCollection
          .find()
          .sort({ createdAt: -1 }) // ✅ sort first
          .limit(6) // ✅ then limit
          .toArray(); // ✅ finally convert to array

        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch featured habits" });
      }
    });
    //! --------------------------------------
    //! ++++++++opore kaj++++++++++++++++++
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
