"use strict";

const express = require("express");
const morgan = require("morgan");
const print = require("./utils/printer");
const dao = require("./db/dao");
const { router: customerRouter } = require("./routers/customerRouter");
const { router: generalRouter } = require("./routers/generalRouter");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const conf = require("./utils/conf");

const app = express();

const BASE_ROUTE = "/api/v1";
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

morgan.token("host", function (req) {
    return "src: " + req.hostname;
});
app.use(morgan(":method".blue + " :url :host code: :status :res[content-length] - :response-time ms"));

app.use(`${BASE_ROUTE}/`, generalRouter);

app.use(
    jwt({
        secret: conf.JWT_SECRET,
        algorithms: ["HS256"],
        getToken: (req) => req.cookies.jwt,
    })
);

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).end();
    }
});

app.use(`${BASE_ROUTE}/customers`, customerRouter);

// every other routes
app.all("/*", (req, res) => res.send("This route is not supported. Check the openapi doc"));

function printConf() {
    print.info("Server running on " + `http://localhost:${PORT}${BASE_ROUTE}`);
}

// "Main"
(async () => {
    try {
        print.info("Initializing the system");

        await dao.open();
        app.listen(PORT, printConf);
    } catch (err) {
        print.err(err, "FAILED initializing the system".red);
        return process.exit(-1);
    }
})();
