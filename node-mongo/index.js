const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dboper = require('./operations'); // CRUD operations



//-------------------------------------------------
const url = "mongodb://127.0.0.1:27017/";
const dbname = "conFusion";
//-------------------------------------------------

MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');

    const db = client.db(dbname); // connectiong to database

    dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, "dishes")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Vadonut" }, { description: "Updated Test" }, "dishes");
        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);

            return db.dropCollection("dishes"); // droping dishes collection
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            return client.close();
        })
        .catch((err) => console.log(err));
})
    .catch((err) => console.log(err)); //  captures error when connecting to mongodb server