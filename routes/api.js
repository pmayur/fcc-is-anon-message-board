"use strict";

module.exports = function (app) {

    app.route("/api/threads/:board")

        .get(require("./controllers/get-threads"))

        .post(require("./controllers/post-thread"))

        .put(require("./controllers/report-thread"))

        .delete(require("./controllers/delete-thread"))


    app.route("/api/replies/:board")

        .get(require("./controllers/get-single-thread"))

        .post(require("./controllers/post-reply"))

        .put(require("./controllers/report-reply"))

        .delete(require("./controllers/delete-reply"))
};
