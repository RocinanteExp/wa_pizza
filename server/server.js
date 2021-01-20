"use strict";

const express = require("express");
const morgan = require("morgan");
const print = require("./utils/printer");
const dao = require("./db/dao");
const { router: customerRouter } = require("./routers/customerRouter");
const { router: generalRouter } = require("./routers/generalRouter");
const cookieParser = require("cookie-parser");

const app = express();

const BASE_ROUTE = "/api/v1";
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

morgan.token("host", function (req) {
    return "src: " + req.hostname;
});
app.use(morgan(":method".blue + " :url :host code: :status :res[content-length] - :response-time ms"));

// GENERAL ROUTER (NO LOGIN NEEDED)
//app.use(`${BASE_ROUTE}`, () => console.log("general handler stub"));

//app.use(
//    jwt({
//        secret: JWT_SECRET,
//        algorithms: ["HS256"],
//        resultProperty: "userId",
//        getToken: (req) => req.cookies.token,
//    }).unless({ path: ["/login", "/logout"] })
//);

//app.use(function (err, req, res, next) {
//    if (err.name === "UnauthorizedError") {
//        res.status(401)
//            .json(
//                StandardErr.new(
//                    "Login middleware",
//                    StandardErr.errno.NOT_ALLOWED,
//                    "login must be performed before this action",
//                    401
//                )
//            )
//            .end();
//    } else {
//        next();
//    }
//});

app.use(`${BASE_ROUTE}/`, generalRouter);
app.use(`${BASE_ROUTE}/customers`, customerRouter);

// every other routes get handled by this handler
app.all("/*", (req, res) => res.send("This route is not supported. Check the openapi doc"));

/**
 * parse command line options
 */
function parseOptions(options) {
    //    for (const option of options) {
    //        switch (option) {
    //            case "--test":
    //                systemConf["--test"] = "testing.db";
    //                systemConf["dbPath"] = "testing.db";
    //                break;
    //            case "--no-autorun":
    //                systemConf[option] = true;
    //                break;
    //            case "--sql-path":
    //                const index = options.indexOf(option);
    //                systemConf["--sql-path"] = options[index + 1];
    //                break;
    //            default:
    //                break;
    //        }
    //    }
}

function printConf() {
    print.info("Server running on " + `http://localhost:${PORT}${BASE_ROUTE}`);
}

// "Main"
(async () => {
    try {
        print.info("Initializing the system");

        dao.open();
        app.listen(PORT, printConf);
    } catch (err) {
        print.err(err, "FAILED initializing the system".red);
        return process.exit(-1);
    }
})();
