const puppeteer = require("puppeteer");
require("dotenv").config();
const {
    MAX_PLAYERS_PER_AWARD,
    DK_SB_DOMAIN,
    DK_AWARDS_TABS_TO_EXCLUDE,
    SPORT_LABEL_MAP,
    DK_SELECTORS,
} = require("./config");

const getTextContent = async (el) =>
    await el.evaluate(({ textContent }) => textContent);

const scrapeLogic = async (sport) => {
    const browser = await puppeteer.launch({
        headless: true,
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
            `https://sportsbook.draftkings.com/leagues/${SPORT_LABEL_MAP[sport]}/${sport}`,
            { waitUntil: "load", timeout: 0 }
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
        await page.waitForSelector(DK_SELECTORS.AWARDS_PAGE_TAB, {
            timeout: 0,
        });
        await new Promise((r) => setTimeout(r, 10000));
        await page.click(DK_SELECTORS.AWARDS_PAGE_TAB);
        // await new Promise((r) => setTimeout(r, 10000));
        // await page.click(DK_SELECTORS.AWARDS_PAGE_TAB);

        const tabs = await getAllElements(awardTabSelector);
        for (const tab of tabs) {
            const tabLabel = (await getTextContent(tab)).toUpperCase();

            if (!DK_AWARDS_TABS_TO_EXCLUDE.includes(tabLabel)) {
                console.log(sport, "tabLabel", tabLabel);
            }
        }

        // Print the full title
        // console.log(logStatement);
    } catch (e) {
        console.error(e);
        return `Something went wrong while running Puppeteer: ${e}`;
    } finally {
        await browser.close();
    }
};

module.exports = { scrapeLogic };
