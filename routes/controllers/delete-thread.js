const Thread = require("../../models/thread");

module.exports = (req, res) => {

    let board               = req.params.board;
    let _id                 = req.body.thread_id;
    let delete_password     = req.body.delete_password;

    const FILTER = { board, _id, delete_password };

    Thread.findOneAndDelete(FILTER).exec( (err, deleted) => {
        if(deleted) {
            return res.send("success")
        }

        return res.send('incorrect password')
    })
}