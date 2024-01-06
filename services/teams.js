const { SUPPORTED_SPORTS, BASKETBALL_POSITIONS } = require("../config");
const { getActivePlayers } = require("./players");
const _ = require("lodash");

const getTeamMapBySport = async (sport) => {
    const responses = await Promise.all(SUPPORTED_SPORTS.map(getActivePlayers));

    const players = _.flatten(responses);

    return players.reduce(
        (
            acc,
            { FirstName, LastName, Status, Position, Team, PositionCategory }
        ) => {
            if (Status !== "Inactive") {
                const sport =
                    BASKETBALL_POSITIONS.includes(Position) &&
                    !["OFF", "DEF"].includes(PositionCategory)
                        ? "NBA"
                        : "NFL";

                if (!acc[sport]) {
                    acc[sport] = {};
                }

                acc[sport][
                    `${FirstName} ${LastName}`
                        .toUpperCase()
                        .replaceAll("Ü", "U")
                        .replaceAll("É", "E")
                        .replaceAll("Í", "I")
                        .replaceAll("Ó", "O")
                        .replaceAll("Á", "A")
                        .replaceAll("Ø", "O")
                        .replaceAll("Ï", "I")
                        .replaceAll("Å", "A")
                        .replaceAll("Ñ", "N")
                        .replaceAll("Æ", "AE")
                        .replaceAll("Ö", "O")
                        .replaceAll("È", "E")
                        .replaceAll("Ê", "E")
                        .replaceAll("Ù", "U")
                        .replaceAll("Â", "A")
                        .replaceAll("Û", "U")
                        .replaceAll("Õ", "O")
                        .replaceAll("Ý", "Y")
                        .replaceAll("Û", "U")
                        .replaceAll("Ô", "O")
                        .replaceAll("Ë", "E")
                        .replaceAll("Ç", "C")
                        .replaceAll("Ì", "I")
                        .replaceAll("Ò", "O")
                        .replaceAll("Æ", "AE")
                        .replaceAll(/(?<!Jr)\./gim, "")
                ] = Team;
            }

            return acc;
        },

        {}
    );
};

const getTeamForPlayer = (name, sport, map) => {
    const sportTeamMap = map[sport.toUpperCase()];

    const team = getTeamFallback(name) || sportTeamMap[name.toUpperCase()];

    if (name.includes("Lamb")) console.log(name);
    if (name === "CeeDee Lamb") return "DAL";

    if (!team) {
        console.log(name);
        // console.log(`No team found for ${name} in ${sport}`);
    }

    return team || "DAL"; //CEeDee Lamp issue
};

const getTeamFallback = (name) => {
    const teamFallbacks = {
        "T.J. Watt": "PIT",
        "Josh Allen (JAX)": "JAX",
        "Will Anderson": "HOU",
        "Ivan Pace": "MIN",
        "CeeDee Lamb": "DAL",
        "Josh Allen": "BUF",
    };

    return teamFallbacks[name] || null;
};

module.exports = { getTeamForPlayer, getTeamMapBySport };
