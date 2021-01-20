"use strict";

const router = require("express").Router();
const dao = require("../db/dao");
const print = require("../utils/printer");
const assert = require("assert");
const jsonwebtoken = require("jsonwebtoken");
const conf = require("../utils/conf");

router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);
router.get("/pizzas/availabilities", getPizzaAvailabilities);

async function handleUserLogin(req, res) {
    const expireTimeInSec = 60 * 60;
    const { email, password } = req.body;

    try {
        const user = await dao.getUserByEmail(email);
        if (user && user.password === password) {
            delete user.password;
            const jwt = jsonwebtoken.sign({ userId: user.id, iat: Date.now() }, conf.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("jwt", jwt, { httpOnly: true, sameSite: true, maxAge: expireTimeInSec * 1000 });
            res.status(200).json(user).end();
            return;
        }

        res.status(401).end();
    } catch (err) {
        res.status(500).end();
    }
}

function handleUserLogout(req, res) {
    res.clearCookie("jwt").end();
}

async function getPizzaAvailabilities(req, res) {
    try {
        const availabilities = await dao.getPizzaAvailabilities();
        res.status(200).json(availabilities).end();
    } catch (err) {
        console.log(err);
        res.status(500).json(err).end();
    }
}

module.exports = { router };
