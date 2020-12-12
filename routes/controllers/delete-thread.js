const Thread = require("../../models/thread");

module.exports = async (req, res) => {

    let board               = req.params.board;
    let _id                 = req.body.thread_id;
    let delete_password     = req.body.delete_password;

    const FILTER = { board, _id, delete_password };

    try {

        await Thread.deleteOne(FILTER);

        return res.send("success")

    } catch (error) {

        return res.send('incorrect password')
    }
}