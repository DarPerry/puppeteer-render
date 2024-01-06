const puppeteer = require("puppeteer");
require("dotenv").config();
const {
    MAX_PLAYERS_PER_AWARD,
    DK_SB_DOMAIN,
    DK_AWARDS_TABS_TO_EXCLUDE,
    SPORT_LABEL_MAP,
    DK_SELECTORS,
} = require("./config");

<<<<<<< HEAD
const getTextContent = async (el) =>
    await el.evaluate(({ textContent }) => textContent);

const scrapeLogic = async (sport) => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });

    const SPORT_LABEL_MAP = {
        nba: "basketball",
        nfl: "football",
    };

    try {
        const page = await browser.newPage();
        const awardTabSelector = `${DK_SELECTORS.ACTIVE_PAGE} ${DK_SELECTORS.AWARD_TABS}`;

        const getAllElements = async (selector) => await page.$$(selector);

        await page.goto(
            `https://sportsbook.draftkings.com/leagues/${SPORT_LABEL_MAP[sport]}/${sport}?category=awards`
        );

        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });

        // Type into search box
        // await page.type(".search-box__input", "automate beyond recorder");

        // Wait and click on first result
        // const searchResultSelector = ".search-box__link";
        // await page.waitForSelector(searchResultSelector);
        // await page.click(searchResultSelector);

        // Locate the full title with a unique string
        await page.waitForSelector(DK_SELECTORS.AWARDS_PAGE_TAB);
        await page.click(DK_SELECTORS.AWARDS_PAGE_TAB);

        const tabs = await getAllElements(awardTabSelector);
        for (const tab of tabs) {
            const tabLabel = (await getTextContent(tab)).toUpperCase();

            if (!DK_AWARDS_TABS_TO_EXCLUDE.includes(tabLabel)) {
                console.log("tabLabel", tabLabel);
            }
        }

        // Print the full title
        // console.log(logStatement);
    } catch (e) {
        console.error(e);
        return `Something went wrong while running Puppeteer: ${e}`;
=======
const scrapeLogic = async (res) => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });
    try {
        const page = await browser.newPage();

        await page.goto(
            "https://sportsbook.draftkings.com/leagues/basketball/nba?wpsrc=Organic%20Search&wpaffn=Google&wpkw=https%3A%2F%2Fsportsbook.draftkings.com%2Fleagues%2Fbasketball%2Fnba&wpcn=leagues&wpscn=basketball%2Fnba"
        );

        // // Set screen size
        // await page.setViewport({ width: 1080, height: 1024 });

        // // Type into search box
        // await page.type(".search-box__input", "automate beyond recorder");

        // // Wait and click on first result
        // const searchResultSelector = ".search-box__link";
        // await page.waitForSelector(searchResultSelector);
        // await page.click(searchResultSelector);

        // Locate the full title with a unique string
        const textSelector = await page.waitForSelector("h1");
        const fullTitle = await textSelector.evaluate((el) => el.textContent);

        // Print the full title
        const logStatement = `The title of this blog post is ${fullTitle}`;
        console.log(logStatement);
        res.send(logStatement);
    } catch (e) {
        console.error(e);
        res.send(`Something went wrong while running Puppeteer: ${e}`);
>>>>>>> fb46f17972dc7f85687938860bbb05a45b164149
    } finally {
        await browser.close();
    }
};

module.exports = { scrapeLogic };
