import _ from "lodash";
import { getTeamForPlayer } from "./teams.js";

const formatScrapedOddsData = (scrapedResults, teamMap) => {
    const finalResults = Object.values(scrapedResults).reduce(
        (acc, { results, sport }) => {
            results.forEach(
                ({
                    awardName,
                    currentAwardOdds,
                    currentAwardRank,
                    playerName,
                }) => {
                    const existingPlayerIdx = acc.findIndex(
                        ({ player: { name } }) => name === playerName
                    );

                    const awardDetails = {
                        name: awardName,
                        rank: currentAwardRank,
                        odds: currentAwardOdds,
                    };

                    if (existingPlayerIdx >= 0) {
                        acc[existingPlayerIdx].awards.push(awardDetails);
                    } else {
                        acc.push({
                            sport: sport.toUpperCase(),
                            player: {
                                name: playerName,
                                team: getTeamForPlayer(
                                    playerName,
                                    sport,
                                    teamMap
                                ),
                            },
                            awards: [awardDetails],
                        });
                    }
                }
            );

            return acc;
        },
        []
    );

    return finalResults;
};

export { formatScrapedOddsData };
