const assert = require('assert');


exports.insertDocment = (db, document, collection, callback) => {

    const coll = db.collection(collection);

    coll.insert(document, (err, result) => {

        assert.strictEqual(err, null);

        console.log("Inserted " + result.result.n + " documents into the collection " + collection);

        callback(result);
    });
};


exports.findDocment = (db, collection, callback) => {

    const coll = db.collection(collection);

    coll.find({}).toArray((err, docs) => {
        assert.strictEqual(err, null);
        callback(docs);
    });
};


exports.removeDocument = (db, document, collection, callback) => {

    const coll = db.collection(collection);

    coll.deleteOne(document, (err, result) => {
        assert.strictEqual(err, null);
        console.log("Removed the document ", document);
        callback(document);
    });
};

exports.updateDocument = (db, document, update, collection, callback) => {

    const coll = db.collection(collection);

    coll.updateOne(document, { $set: update }, null, (err, result) => {

        assert.strictEqual(err, null);
        console.log("Updated the document with ", update);
        callback(result);
    });
};
