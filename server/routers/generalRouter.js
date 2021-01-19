"use strict";

const router = require("express").Router();
const dao = require("../db/dao");
const print = require("../utils/printer");
const assert = require("assert");
const jsonwebtoken = require("jsonwebtoken");
const conf = require("../utils/conf");

router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    console.log(req.cookies);

    const user = await dao.getUserByEmail(email);
    const jwt = jsonwebtoken.sign({ userId: user.id, iat: Date.now() }, conf.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("jwt", jwt, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.status(200).json(user).end();
}

function handleUserLogout(req, res) {
    res.clearCookie("jwt").end();
}

module.exports = { router };
