const Thread = require("../models/thread");

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

    createNewThread = (board = this.BOARD.TEST) => {
        let text            = this.randomWord;
        let delete_password = text

        return new Promise( async (resolve, reject) => {
            try {

                let threadObj = { board, text, delete_password };
                let thread = await new Thread(threadObj).save();

                resolve(thread);
            } catch (error) {
                reject("TEST_ERR: error in creating new thread")
            }
        })
    }

    time = (time) => {
        return new Date(time).getTime();
    }
}

module.exports = TestUtil;
