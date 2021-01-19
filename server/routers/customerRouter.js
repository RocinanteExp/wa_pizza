"use strict";

const router = require("express").Router();
const dao = require("../db/dao");
const print = require("../utils/printer");
const assert = require("assert");

router.get("/:id/orders", getOrders);
router.post("/:id/orders", addOrder);

const expOrderFields = ["size", "ingredients", "quantity", "price", "extra", "discount"];
const integerFields = ["quantity", "price", "extra", "discount"];

async function getOrders(req, res) {
    const orders = await dao.getOrdersByUserId(null);
    console.log(orders);

    res.json(orders);
}

async function addOrder(req, res) {
    const order = req.body;

    const error = validateOrder(order);
    if (error) {
        print.error(error);
        return;
    }

    try {
        const res = await dao.saveOrder(order);
        console.log("ret of saveOrder from addOrder", res);
    } catch (err) {
        print.err(err);
    }

    res.status(204).end();
}

function validateOrder(order) {
    for (const orderItem of order) {
        assert(expOrderFields.every((field) => orderItem.hasOwnProperty(field)));
        assert(integerFields.every((field) => typeof orderItem[field] === "number"));
    }

    for (const orderItem of order) {
        for (const ingredient of orderItem.ingredients) {
            assert(ingredient.side !== undefined);
        }
    }
}

module.exports = { router };
