import dayjs from "dayjs";
import dotenv from "dotenv";

import { SUPPORTED_SPORTS } from "./config.js";
import { scrapeLogic } from "./scrapeLogic.js";
import { getTeamMapBySport } from "./services/teams.js";
import { insertFetchedResults } from "./services/database.js";
import { formatScrapedOddsData } from "./services/formatters.js";

dotenv.config();

(async () => {
    console.log("Starting Odds Scraping...");
    const teamMap = await getTeamMapBySport();
    const scrapedAwardOdds = await Promise.all(
        SUPPORTED_SPORTS.map(scrapeLogic)
    );

    console.log("Formatting Data...");
    const formattedResults = formatScrapedOddsData(scrapedAwardOdds, teamMap);

    const results = {
        fetchedAt: dayjs().toISOString(),
        results: formattedResults,
    };

    console.log("Odds Scraping Complete...");

    const dbResults = await insertFetchedResults(results);

    console.log("Database Results: ", dbResults);
})();
