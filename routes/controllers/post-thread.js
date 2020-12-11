const Thread    = require("../../models/thread");
const { ERR }   = require("../../util/errors");

module.exports = (req, res) => {
    let board = req.params.board;
    let text = req.body.text;
    let delete_password = req.body.delete_password;

    let thread = new Thread({ board, text, delete_password });

    thread.save((err, result) => {
        if (err) {
            return res.send(ERR.INCOMPLETE_INPUT);
        }

        return res.json(result);
    });
};
