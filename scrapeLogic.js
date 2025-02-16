import dotenv from "dotenv";
import puppeteer from "puppeteer";

import {
    MAX_PLAYERS_PER_AWARD,
    DK_AWARDS_TABS_TO_EXCLUDE,
    DK_SELECTORS,
} from "./config.js";

dotenv.config();

const getTextContent = async (el) =>
    await el.evaluate(({ textContent }) => textContent);

const setPageTimeout = (timeout = 3500) =>
    new Promise((r) => setTimeout(r, timeout));

const waitForText = async (cell, selector) => {
    const element = await cell.waitForSelector(selector, {
        timeout: 60000,
    });

    return await getTextContent(element);
};

const isProduction = process.env.NODE_ENV === "production";

const scrapeLogic = async (sport) => {
    const puppeteerArgs = [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--no-zygote",
    ];
    if (isProduction) puppeteerArgs.push("--single-process");

    const browser = await puppeteer.launch({
        headless: true,
        args: puppeteerArgs,
        executablePath: isProduction
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });

    const SPORT_LABEL_MAP = {
        nba: "basketball",
        nfl: "football",
    };

    const results = [];

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
        const oddsCellSelectors = `${DK_SELECTORS.ACTIVE_PAGE} ${DK_SELECTORS.ODDS_CELL}`;

        // Type into search box
        // await page.type(".search-box__input", "automate beyond recorder");

        // Wait and click on first result
        // const searchResultSelector = ".search-box__link";
        // await page.waitForSelector(searchResultSelector);
        // await page.click(searchResultSelector);

        // Locate the full title with a unique string

        const awardsTab = await page.$(DK_SELECTORS.AWARDS_PAGE_TAB);

        if (!awardsTab) {
            console.log("No Awards Tab Found For", sport.toUpperCase());
            return { sport, results };
        }

        await page.waitForSelector(DK_SELECTORS.AWARDS_PAGE_TAB);
        await new Promise((r) => setTimeout(r, 10000));
        await page.click(DK_SELECTORS.AWARDS_PAGE_TAB);
        await new Promise((r) => setTimeout(r, 10000));
        await page.click(DK_SELECTORS.AWARDS_PAGE_TAB);
        await page.click(DK_SELECTORS.AWARDS_PAGE_TAB);

        const tabs = await getAllElements(awardTabSelector);
        for (const tab of tabs) {
            const tabLabel = (await getTextContent(tab)).toUpperCase();

            if (!DK_AWARDS_TABS_TO_EXCLUDE.includes(tabLabel)) {
                console.log(
                    `${sport.toUpperCase()} - Parsing ${tabLabel} Odds...`
                );
                let rank = 1;

                await tab.click();
                await setPageTimeout();

                const oddsCells = await getAllElements(oddsCellSelectors);

                if (!oddsCells.length)
                    console.log("No results found for", tabLabel);

                for (const cell of oddsCells) {
                    if (rank > MAX_PLAYERS_PER_AWARD) break;

                    const odds = await waitForText(cell, DK_SELECTORS.ODDS);
                    const player = await waitForText(cell, DK_SELECTORS.NAME);

                    results.push({
                        playerName: player,
                        awardName: tabLabel,
                        currentAwardRank: rank++,
                        currentAwardOdds: Number(odds.replace("−", "-")),
                    });
                }
            }
        }

        console.log(
            `${sport.toUpperCase()} - Odds Scraping Complete. ${
                results.length
            } Odds Parsed...`
        );

        return { sport, results };

        // Print the full title
        // console.log(logStatement);
    } catch (e) {
        console.error(e);
        return `Something went wrong while running Puppeteer: ${e}`;
    } finally {
        await browser.close();
    }
};

export { scrapeLogic };
