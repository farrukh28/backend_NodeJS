const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dboper = require('./operations'); // CRUD operations



//-------------------------------------------------
const url = "mongodb://127.0.0.1:27017/";
const dbname = "conFusion";
//-------------------------------------------------

MongoClient.connect(url, (err, client) => {

    assert.strictEqual(err, null);

    console.log("Connected correctly to Server");

    const db = client.db(dbname); // connecting to database

    dboper.insertDocment(db, { name: "Vandonut", description: "Test" }, "dishes", (result) => {

        console.log("Insert Document:\n", result.ops);

        dboper.findDocment(db, "dishes", (docs) => {

            console.log("Found documents:\n", docs);

            dboper.updateDocument(db, { name: "Vandonut" }, { description: "Updated Test" }, "dishes", (result) => {

                console.log("Updated Document:\n", result.result);

                dboper.findDocment(db, "dishes", (result) => {
                    console.log("Found documents:\n", result);

                    db.dropCollection("dishes", (err, result) => {

                        assert.strictEqual(err, null);
                        console.log("Dropped Collection:\n", result);

                        client.close(); // closing connection to database
                    });
                });
            });
        });
    });
});