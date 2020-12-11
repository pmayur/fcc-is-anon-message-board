const Thread = require("../../models/thread");
const { ERR } = require("../../util/errors");

module.exports = async (req, res) => {

    let board     = req.params.board;
    let thread_id = req.query.thread_id;

    const SELECTORS = { delete_password: 0, reported: 0 };
    const FILTER    = { _id: thread_id, board };

    try {

        // find the thread with only selected values
        let thread = await Thread.findOne(FILTER).select(SELECTORS);

        // populate thread object's replies array with reply objects
        await thread.populate("replies").execPopulate();

        return res.json(thread);

    } catch (error) {

        return res.send(ERR.INVALID_ID)
    }
}