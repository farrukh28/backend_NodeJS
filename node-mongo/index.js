const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://127.0.0.1:27017/";
const dbname = "conFusion";

MongoClient.connect(url, (err, client) => {

    assert.strictEqual(err, null);

    console.log("Connected correctly to Server");

    const db = client.db(dbname); // connecting to database

    const collection = db.collection("dishes"); // connecting to dishes

    // inserting a document
    collection.insertOne({ "name": "Uthappizza", "description": "test" }, (err, result) => {

        assert.strictEqual(err, null);

        console.log("After Insert:\n");
        console.log(result.ops); // result.ops returns documents which are inserted with added "_id" fields

        collection.find({}).toArray((err, docs) => {

            assert.strictEqual(err, null);

            console.log("Found:\n");
            console.log(docs);

            // deleting collection(table)
            collection.drop("dishes", (err, res) => {

                assert.strictEqual(err, null);

                // closing connection to database
                client.close();
            });
        });
    });
});