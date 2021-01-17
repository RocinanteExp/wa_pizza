"use strict";

const router = require("express").Router();
const dao = require("../db/dao");
const print = require("../utils/printer");
const assert = require("assert");

router.get("/login", handleUserLogin);
router.post("/logout", handleUserLogout);

function handleUserLogin(req, res) {
    print.info("sono login");
    res.end();
}

function handleUserLogout(req, res) {
    print.info("sono login");
    res.end();
}


module.exports = { router };
