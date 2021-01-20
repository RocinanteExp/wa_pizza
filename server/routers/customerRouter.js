"use strict";

const router = require("express").Router();
const dao = require("../db/dao");
const print = require("../utils/printer");
const assert = require("assert");

router.get("/:id/orders", getOrders);
router.post("/:id/orders", addOrder);

const expOrderFields = ["size", "ingredients", "quantity", "price", "extra", "discount"];
const integerFields = ["quantity", "price", "extra", "discount"];

const errno = {
    ORDER_INVALID: 1,
    PIZZA_QUANTITY_INSUFFICIENT: 10,
};

/**
 * 200
 * 500 generic db error
 */
async function getOrders(req, res) {
    try {
        const orders = await dao.getOrdersByUserId(req.params.id);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
}

/**
 * 204 order saved into the db
 * 400 bad request. failed validateOrder
 * 409 the requested number of pizza exceed the number of available pizzas
 * 500 generic db error
 */
async function addOrder(req, res) {
    const order = req.body;

    const isOk = validateOrder(order);
    if (!isOk) {
        res.status(400).json({
            error: {
                code: errno.ORDER_INVALID,
                message: "invalid order",
            },
        });
        return;
    }

    if (process)
        try {
            const { doProceed, availabilities } = await checkPizzaAvailabilities(order);

            if (doProceed) {
                await dao.saveOrder(order);

                //compute current availabilities
                for (const item of order) {
                    availabilities[item.size] -= item.quantity;
                }

                await dao.updatePizzaAvailabilities(availabilities);
                res.status(204).end();
            } else {
                res.status(409).json({
                    error: {
                        code: errno.PIZZA_QUANTITY_INSUFFICIENT,
                        message: availabilities,
                    },
                });
            }
        } catch (err) {
            print.err(err);
            res.status(500).json(err);
        }
}

function validateOrder(order) {
    for (const orderItem of order) {
        let isOk = expOrderFields.every((field) => orderItem.hasOwnProperty(field));
        if (!isOk) return false;

        isOk = integerFields.every((field) => typeof orderItem[field] === "number");
        if (!isOk) return false;
    }

    for (const orderItem of order) {
        for (const ingredient of orderItem.ingredients) {
            if (ingredient.side !== "left" && ingredient.side !== "right" && ingredient.side !== "both") return false;
        }
    }

    return true;
}

async function checkPizzaAvailabilities(order) {
    const requested = { small: 0, medium: 0, large: 0 };
    const availabilities = await dao.getPizzaAvailabilities();

    let doProceed = true;

    for (const item of order) {
        requested[item.size] += item.quantity;
        if (requested[item.size] > availabilities[item.size]) {
            doProceed = false;
            break;
        }
    }

    return { doProceed, availabilities };
}

module.exports = { router };
