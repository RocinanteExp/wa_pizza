"use strict";

const router = require("express").Router();
const print = require("../utils/printer");
const assert = require("assert");

router.get("/:id/orders", getOrders);
router.post("/:id/orders", addOrder);

function getOrders(req, res) {
    print.out("sono getOrders");
    res.end();
}

const expOrderFields = ["size", "ingredients", "quantity", "price", "extra", "discount"];
const integerFields = ["quantity", "price", "extra", "discount"];

function validateOrder(obj) {
    for (const elem of obj) {
        assert(expOrderFields.every((field) => elem.hasOwnProperty(field)));
        assert(integerFields.every((field) => typeof elem[field] === "number"));
    }

    print.out(obj);
}

function addOrder(req, res) {
    const error = validateOrder(req.body);
    res.end();
}
module.exports = { router };
