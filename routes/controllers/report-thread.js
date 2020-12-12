const Thread = require("../../models/thread");
const { ERR } = require("../../util/errors");

module.exports = async (req, res) => {

    let _id         = req.body.thread_id;
    let board       = req.params.board;

    const FILTER    = { _id, board };
    const OPTIONS   = { timestamps: false }

    try {

        // find the thread
        let thread = await Thread.findOne(FILTER);

        // set the found thread's reported value to true
        thread.reported = true;

        // save updated thread
        await thread.save(OPTIONS);

        res.send("success")

    } catch (error) {
        return res.send(ERR.INVALID_ID)
    }
}