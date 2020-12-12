const Reply = require("../../models/reply");
const { ERR } = require("../../util/errors");

module.exports = async (req, res) => {

    let parent      = req.body.thread_id;
    let _id         = req.body.reply_id;

    const FILTER    = { parent, _id }
    const OPTIONS   = { timestamps: false }
    try {

        // find the reply
        let reply       = await Reply.findOne(FILTER);

        // set the found reply to be reported
        reply.reported  = true;

        // save the reported reply
        await reply.save(OPTIONS);

        res.send("reported")

    } catch (error) {
        return res.send(ERR.INVALID_ID)
    }
}