const BASKETBALL_POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const DK_AWARDS_TABS_TO_EXCLUDE = ["COACH", "COACH OF THE YEAR"];

const DK_SELECTORS = {
    ACTIVE_PAGE: ".sportsbook-responsive-card-container__card.selected",
    AWARDS_PAGE_TAB: "#game_category_Awards",
    AWARD_TABS:
        ".sportsbook-tabbed-subheader .sportsbook-tabbed-subheader__tab-link",
    NAME: ".sportsbook-outcome-cell__label",
    ODDS: ".sportsbook-odds",
    ODDS_CELL: ".sportsbook-outcome-cell",
    ODDS_CONTAINER: ".sportsbook-responsive-card-container__card.selected",
};

const DK_SB_DOMAIN = "https://sportsbook.draftkings.com/leagues";

const MAX_PLAYERS_PER_AWARD = 6;

const SPORT_LABEL_MAP = {
    nba: "basketball",
    nfl: "football",
};

const SUPPORTED_SPORTS = Object.keys(SPORT_LABEL_MAP);

module.exports = {
    BASKETBALL_POSITIONS,
    DK_AWARDS_TABS_TO_EXCLUDE,
    DK_SB_DOMAIN,
    DK_SELECTORS,
    MAX_PLAYERS_PER_AWARD,
    SPORT_LABEL_MAP,
    SUPPORTED_SPORTS,
};
