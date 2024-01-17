const dayjs = require("dayjs");
const {
    scrapeDraftKingsAwardsOddsForSport,
    scrapeLogic,
} = require("./scrapeLogic");
const { getTeamMapBySport } = require("./services/teams");
const { formatScrapedOddsData } = require("./services/formatters");
const { SUPPORTED_SPORTS } = require("./config");
const { insertFetchedResults } = require("./services/database");
const puppeteer = require("puppeteer");

(async () => {
    const isProduction = process.env.NODE_ENV === "production";
    const args = ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"];
    const headless = isProduction ? "new" : false;
    if (isProduction) args.push("--single-process");

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
