const Thread    = require("../../models/thread");
const Reply     = require("../../models/reply");
const { ERR }   = require("../../util/errors");


module.exports = async (req, res) => {

    let parent          = req.body.thread_id;
    let text            = req.body.text;
    let delete_password = req.body.delete_password;

    let thread;
    let reply;

    try {

        // find the thread requested to be replied to
        thread  = await Thread.findById(parent);

        // save the reply with reference to the thread if found
        reply   = await createReply(thread, text, delete_password).save();

        // push the reply saved to the found thread
        thread.replies.push(reply);

        // save the thread with new reply pushed
        thread  = await thread.save();

        // populate the saved thread with all replies
        await thread.populate("replies").execPopulate();

        // return with the populated thread
        return res.json(thread);

    } catch (error) {
        console.log(error.message);
        return res.send(ERR.INVALID_INPUT)
    }
}

// creates a new Reply model instance
createReply = (parent, text, delete_password) => {
    return new Reply({ parent, text, delete_password })
}