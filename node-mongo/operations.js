const assert = require('assert');

//-----------------------------------INSERT---------------------------------------------
exports.insertDocument = (db, document, collection) => {

    const coll = db.collection(collection);

    return coll.insert(document);
};

//--------------------------------------FIND------------------------------------------

exports.findDocuments = (db, collection) => {

    const coll = db.collection(collection);

    return coll.find({}).toArray();
};

//--------------------------------------DELETE------------------------------------------

exports.removeDocument = (db, document, collection) => {

    const coll = db.collection(collection);

    return coll.deleteOne(document);
};

//-------------------------------------UPDATE-------------------------------------------

exports.updateDocument = (db, document, update, collection) => {

    const coll = db.collection(collection);

    return coll.updateOne(document, { $set: update });
};

//--------------------------------------------------------------------------------