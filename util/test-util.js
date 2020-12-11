const words = [
    "darvon",
    "erythrocyte",
    "noctambulism",
    "deckpipe",
    "hippomenes",
    "stepchild",
    "waking",
    "eyeable",
    "predictate",
    "preoesophageal",
    "debruise",
    "potability",
    "plod",
    "nonadapter",
    "outsuck",
    "putaminous",
    "puristically",
    "bertie",
    "kazazachki",
    "undertook",
    "kurus",
    "idabel",
    "bedridden",
    "undiabetic",
    "hyperbolizing",
    "oligarchy",
    "cleveite",
    "papain",
    "abundant",
    "adulated",
    "prefabricate",
    "decasyllabic",
    "bhajan",
    "sepaline",
    "mindfully",
    "saluter",
    "supervenosity",
    "bandersnatch",
    "bottomlessness",
    "woodturner",
    "sweetmeat",
    "animalized",
    "nonpoetic",
    "midweek",
    "synechist",
    "renlistment",
    "cytostomal",
    "unshown",
    "oarlike",
    "constructivist",
];

class TestUtil {
    constructor() {
        this.BOARD = {
            TEST: "testing",
        };
    }

    get randomWord() {
        var randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }
}

module.exports = TestUtil;
