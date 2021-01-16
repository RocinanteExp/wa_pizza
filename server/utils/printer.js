"use strict";
const color = require("colors");

const print = {};

print.grp = (label) => {
    console.group(label);
};

print.info = (msg) => {
    console.log("INFO: ".green + msg);
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

print.err = (message) => {
    console.error("ERRORE");
    console.error(...message);
};

module.exports = print;
