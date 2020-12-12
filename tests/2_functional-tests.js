const chaiHttp      = require("chai-http");
const chai          = require("chai");
const server        = require("../server");
const TestUtil      = require("../util/test-util");
const Reply         = require("../models/reply");
const Thread        = require("../models/thread");

const assert        = chai.assert;
const util          = new TestUtil(); // test utilities class

chai.use(chaiHttp);

suite("Functional Tests", () => {

    const BOARD = util.BOARD.TEST;

    suite("Creating Thread", () => {

        let text            = util.randomWord;
        let delete_password = text;             // same as text for simplicity

        test("Create a new Thread under a board", (done) => {
            chai.request(server)
                .post(`/api/threads/${BOARD}`)
                .send({
                    text,
                    delete_password
                })
                .end( (err, res) => {

                    assert.equal(res.status, 200);
                    assert.notExists(err);

                    assert.exists(res.body._id);
                    assert.exists(res.body.created_on);
                    assert.exists(res.body.bumped_on);

                    assert.isFalse(res.body.reported);
                    assert.isArray(res.body.replies);
                    assert.equal(res.body.text, text);
                    assert.equal(res.body.delete_password, delete_password);

                    done();
                });
        });
    });

    suite("Creating Reply", () => {

        let thread;
        let thread_id;

        before( async () => {
            try {
                thread      = await util.createNewThread(BOARD);
                thread_id   = thread.id;
            } catch (error) {
                console.error(error);
            }
        })

        test("Create a new Reply on a thread", (done) => {

            let text            = util.randomWord;
            let delete_password = text;

            chai.request(server)
                .post(`/api/replies/${BOARD}`)
                .send({
                    thread_id,
                    text,
                    delete_password
                })
                .end( (err, res) => {

                    assert.equal(res.status, 200);
                    assert.notExists(err);
                    assert.equal(res.body.replies.length, 1);

                    let exp = thread;
                    let act = res.body;

                    assert.equal(exp._id, act._id);
                    assert.equal(exp.text, act.text);
                    assert.equal(exp.delete_password, act.delete_password);
                    assert.equal(util.time(exp.created_on), util.time(act.created_on));
                    assert.notEqual(util.time(exp.bumped_on), util.time(act.bumped_on));

                    let reply = res.body.replies[0];

                    assert.equal(reply.text, text);
                    assert.equal(reply.delete_password, delete_password);

                    done();
                })
        });

        test("Create a second Reply on a thread", (done) => {

            let text            = util.randomWord;
            let delete_password = text;


            chai.request(server)
                .post(`/api/replies/${BOARD}`)
                .send({
                    thread_id,
                    text,
                    delete_password
                })
                .end( (err, res) => {

                    assert.equal(res.status, 200);
                    assert.notExists(err);
                    assert.equal(res.body.replies.length, 2);

                    let exp = thread;
                    let act = res.body;

                    assert.equal(exp._id, act._id);
                    assert.equal(exp.text, act.text);
                    assert.equal(exp.delete_password, act.delete_password);
                    assert.equal(util.time(exp.created_on), util.time(act.created_on));
                    assert.notEqual(util.time(exp.bumped_on), util.time(act.bumped_on));

                    let reply = res.body.replies[1];

                    assert.equal(reply.text, text);
                    assert.equal(reply.delete_password, delete_password);

                    done();
                })
        });
    });

    suite("Viewing the threads", () => {

        test("Get 10 recently bumped threads", (done) => {

            chai.request(server)
                .get(`/api/threads/${BOARD}`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.notExists(err);

                    assert.isArray(res.body);
                    assert.isAtMost(res.body.length, 10);

                    let timeA = util.time(res.body[0].bumped_on)
                    let timeB = util.time(res.body[1].bumped_on)

                    assert.isAbove(timeA, timeB);

                    res.body.forEach((element) => {

                        let replies = element.replies;
                        let length  = replies.length;

                        assert.equal(element.replycount, length)
                        assert.isAtMost(length, 3);

                        if( length > 1 ) {
                            assert.isAbove(
                                util.time(replies[0].created_on),
                                util.time(replies[1].created_on)
                            )
                        }
                    });

                    done();
                })
        })

    })

    suite("View single thread", () => {

        let thread;
        let thread_id;

        before( async () => {
            try {

                thread      = await util.randomThreadWithReplies(BOARD);
                thread_id   = thread._id.toString();
            } catch (error) {
                console.error(error)
            }
        })

        test("Get a thread with details and replies", (done) => {

            chai.request(server)
                .get(`/api/replies/${BOARD}`)
                .query({ thread_id })
                .end((err, res) => {

                    assert.equal(res.status, 200);
                    assert.notExists(err);

                    assert.exists(res.body._id);
                    assert.exists(res.body.created_on);
                    assert.exists(res.body.bumped_on);
                    assert.exists(res.body.text);

                    assert.notExists(res.body.delete_password);
                    assert.notExists(res.body.reported);

                    let replies = res.body.replies;

                    assert.isArray(replies);
                    assert.equal(res.body.__v, replies.length);

                    replies.forEach(reply => {
                        assert.exists(reply.text);
                        assert.exists(reply.parent);
                        assert.exists(reply.delete_password);
                        assert.exists(reply.reported);
                    });

                    done();
                })
        })
    })

    suite("Reporting", () => {

        // for report thread test
        let thread, thread_id, bumped_on;

        // for report reply test
        let replies, testReply, reply_id;

        before( async () => {
            try {
                // Details required for reporting thread
                thread      = await util.randomThreadWithReplies(BOARD);
                thread_id   = thread._id.toString();
                bumped_on   = thread.bumped_on

                // Details required for reporting a reply
                replies     = thread.replies;
                let index   = util.randomIndex(replies.length); // random index

                testReply   = replies[index];
                reply_id    = testReply._id;

            } catch (error) {
                console.error(error)
            }
        })

        test("Report a thread", (done) => {

            chai.request(server)
                .put(`/api/threads/${BOARD}`)
                .send({ thread_id })
                .end( async (err, res) => {

                    try {

                        let reportedThread          = await Thread.findById(thread_id);
                        let bumpedOnPreReporting    = util.time(bumped_on);
                        let bumpedOnPostReporting   = util.time(reportedThread.bumped_on);

                        assert.isTrue(reportedThread.reported);
                        assert.equal(bumpedOnPostReporting, bumpedOnPreReporting);

                        assert.equal(res.status, 200);
                        assert.notExists(err);
                        assert.equal(res.text, "success");

                        done();

                    } catch (error) {
                        done(error);
                    }
                })
        })

        test("Report a reply", (done) => {

            chai.request(server)
                .put(`/api/replies/${BOARD}`)
                .send({ thread_id, reply_id })
                .end( async (err, res) => {
                    try {

                        assert.equal(res.status, 200);
                        assert.notExists(err);
                        assert.equal(res.text, "reported");

                        let reportedReply = await Reply.findById(reply_id);
                        assert.isTrue(reportedReply.reported);
                        done();

                    } catch (error) {
                        done(error)
                    }
                })
        })
    })

    suite("Deleting a thread", () => {

        let thread, thread_id, delete_password;

        before( async () => {
            try {

                thread          = await util.randomThreadWithReplies(BOARD);
                thread_id       = thread._id.toString();
                delete_password = thread.delete_password;

            } catch (error) {
                console.error(error);
            }
        })

        test("Delete a thread by sending a delete request", (done) => {

            chai.request(server)
                .delete(`/api/threads/${BOARD}`)
                .send({ thread_id, delete_password })
                .end( async (err, res) => {
                    try {
                        assert.equal(res.status, 200);
                        assert.notExists(err);
                        assert.equal(res.text, "success");

                        let deleted = await Thread.findById(thread_id);
                        assert.isNull(deleted);

                        done();

                    } catch (error) {
                        done(error);
                    }
                })
        })

        test("Delete a thread with incorrect password", (done) => {

            let delete_password = "incorrect_password"

            chai.request(server)
                .delete(`/api/threads/${BOARD}`)
                .send({ thread_id, delete_password })
                .end( (err, res) => {

                    assert.equal(res.status, 200);
                    assert.notExists(err);
                    assert.equal(res.text, "incorrect password");
                    done();
                })
        })
    })

    suite("Delete a reply", () => {

        let thread_id, reply_id, delete_password;

        before( async() => {

            try {
                let thread          = await util.randomThreadWithReplies();

                let replies         = thread.replies;
                let index           = util.randomIndex(replies.length);
                let testReply       = await Reply.findOne(replies[index])

                thread_id           = thread._id.toString();
                reply_id            = testReply._id.toString();
                delete_password     = testReply.delete_password;

            } catch (error) {
                console.error(error)
            }
        })

        test("Delete a reply with delete request", (done) => {

            const REQUEST_BODY = { thread_id, reply_id, delete_password };

            chai.request(server)
                .delete(`/api/replies/${BOARD}`)
                .send(REQUEST_BODY)
                .end( async (err, res) => {
                    try {
                        assert.equal(res.status, 200);
                        assert.notExists(err);
                        assert.equal(res.text, "success");

                        let deletedReply = await Reply.findById(reply_id);
                        assert.equal(deletedReply.text, "[deleted]");

                        done();
                    } catch (error) {
                        done(error);
                    }
                })
        })

        test("Delete a reply with incorrect password", (done) => {

            let delete_password = "incorrect_password"

            const REQUEST_BODY = { thread_id, reply_id, delete_password };

            chai.request(server)
                .delete(`/api/replies/${BOARD}`)
                .send(REQUEST_BODY)
                .end( (err, res) => {

                    assert.equal(res.status, 200);
                    assert.notExists(err);
                    assert.equal(res.text, "incorrect password");
                    done();
                })
        })
    })

});

