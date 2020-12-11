const chaiHttp      = require("chai-http");
const chai          = require("chai");
const server        = require("../server");
const TestUtil      = require("../util/test-util");

const assert        = chai.assert;
const util          = new TestUtil(); // test utilities class

chai.use(chaiHttp);

suite("Functional Tests", () => {

    suite("Creating Thread", () => {

        let board           = util.BOARD.TEST;  // board for testing
        let text            = util.randomWord;
        let delete_password = text;             // same as text for simplicity

        test("Create a new Thread under a board", (done) => {
            chai.request(server)
                .post(`/api/threads/${board}`)
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

        let board           = util.BOARD.TEST;

        let thread;
        let thread_id;

        before( async () => {
            try {
                thread      = await util.createNewThread(board);
                thread_id   = thread.id;
            } catch (error) {
                console.log(error);
            }
        })

        test("Create a new Reply on a thread", (done) => {

            let text            = util.randomWord;
            let delete_password = text;

            chai.request(server)
                .post(`/api/replies/${board}`)
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
                .post(`/api/replies/${board}`)
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

        let board = util.BOARD.TEST;

        test("Get 10 recently bumped threads", (done) => {

            chai.request(server)
                .get(`/api/threads/${board}`)
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
});

