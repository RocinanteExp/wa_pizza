"use strict";
const color = require("colors");

const print = {};

print.grp = (label) => {
    console.group(label);
};

print.info = (...msg) => {
    console.log("INFO: ".green);
    console.log(msg);
};

print.err = (msg) => {
    console.error("ERROR: ".red, msg);
};

print.grpend = () => {
    console.groupEnd();
};

print.out = (...message) => {
    console.log(...message);
};

print.tb = (array) => {
    console.table(array);
};


module.exports = print;
