"use strict";

module.exports = function (app) {

    app.route("/api/threads/:board")
       .post(require("./controllers/post-thread"));

    app.route("/api/replies/:board")
        .post(require("./controllers/post-reply"));
};
