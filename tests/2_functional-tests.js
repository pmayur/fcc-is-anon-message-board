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
});
