"use strict";

const router = require("express").Router();
const dao = require("../db/dao");
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

    for (const elem of obj) {
        for(const ingredient of elem.ingredients) {
            assert(ingredient.side !== undefined);
        }
    }
}

async function addOrder(req, res) {
    const order = req.body;
    
    const error = validateOrder(order);
    if(error) {
        print.error(error);
        return;
    }

    try {
        await dao.saveOrder(order);
        return;
    } catch(err) {
        print.err(err);
        return;
    }

    res.end();
}
module.exports = { router };
