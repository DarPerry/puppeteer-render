const { MongoClient } = require("mongodb");
const { URI } = require("../config");

const insertFetchedResults = async (results) => {
    const client = new MongoClient(
        "mongodb+srv://darjperry:B4oTmacTTOUSJbW8@main.efyqolw.mongodb.net/?retryWrites=true&w=majority"
    );

    try {
        const database = client.db("cardphin");
        const cards = database.collection("fetchResults");

        return await cards.insertOne(results);
    } finally {
        await client.close();
    }
};

module.exports = { insertFetchedResults };
