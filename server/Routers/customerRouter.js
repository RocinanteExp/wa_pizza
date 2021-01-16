"use strict";

const express = require("express");
const router = express.Router();

router.put("/:id/orders", getOrders);

function getOrders() {};

module.exports = { router };
