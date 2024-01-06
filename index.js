const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

(async () => {
    await Promise.all(["nfl", "nba"].map(scrapeLogic));
})();
