const Reply = require("../../models/reply");

module.exports = async (req, res) => {

    let parent = req.body.thread_id;
    let _id = req.body.reply_id;
    let delete_password = req.body.delete_password;

    const FILTER = { parent, _id, delete_password };

    try {

        let reply = await Reply.findOne(FILTER);

        reply.text = "[deleted]";

        await reply.save();

        return res.send("success")

    } catch (error) {
        return res.send("incorrect password")
    }

}
