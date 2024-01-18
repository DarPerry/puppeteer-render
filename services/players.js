import axios from "axios";

const getActivePlayers = async (sport) => {
    const url =
        sport == "nba"
            ? "https://api.sportsdata.io/v3/nba/scores/json/PlayersActiveBasic?key=22f82b8daef6426ab7d77d061eae86de"
            : "https://api.sportsdata.io/v3/nfl/scores/json/PlayersByAvailable?key=e340a235c01640018359b01b03877534";
    const { data } = await axios.get(url);

    return data;
};

export { getActivePlayers };
