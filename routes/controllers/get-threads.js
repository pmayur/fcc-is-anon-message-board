const Thread = require("../../models/thread");
const Reply  = require("../../models/reply");

module.exports = async (req, res) => {
    let board = req.params.board;

    const LIMIT = 10;
    const SORT_BY = { bumped_on: 'desc' };
    const FILTER = { board };

    try {

        // find sorted threads upto limit for the given board
        let result = await Thread.find(FILTER).sort(SORT_BY).limit(LIMIT);

        // set an empty array to store promises
        let promisesArray = [];

        result.forEach( (thread) => {

            // for every thread push promise which gets formatted details
            promisesArray.push( getThreadDetails(thread) )
        });

        let threads = await Promise.all(promisesArray)

        return res.send(threads)

    } catch (error) {
        return res.error(error)

    }
}

// returns promise with only the required details for given thread
const getThreadDetails = async (thread) => {

    return new Promise( async(resolve, reject) => {
        try {

            let result = {
                _id         : thread._id,
                text        : thread.text,
                created_on  : thread.created_on,
                bumped_on   : thread.bumped_on,
                replycount  : thread.__v,
                replies     : await getReplies(thread._id)
            }

            resolve(result);
        } catch (error) {

            reject(error)
        }
    })
}

// returns promise with latest 3 replies on the given thread id
const getReplies = async (parent) => {

    const SORT_BY   = { created_on: 'desc' };
    const LIMIT     = 3;

    return new Promise( async(resolve, reject) => {

        try {

            let result = await Reply.find({ parent })
                                    .sort(SORT_BY)
                                    .limit(LIMIT);

            resolve(result);

        } catch (error) {
            reject(`unable to get replies for id: "${parent}"`);
        }

    })
}