import { MongoClient } from "mongodb";

const insertFetchedResults = async (results) => {
    const client = new MongoClient(
        "mongodb+srv://darjperry:9ylLaZsttLXvcFNH@main.efyqolw.mongodb.net/?retryWrites=true&w=majority"
    );

    try {
        const database = client.db("cardphin");
        const cards = database.collection("fetchResults");

        return await cards.insertOne(results);
    } finally {
        await client.close();
    }
};

export { insertFetchedResults };
