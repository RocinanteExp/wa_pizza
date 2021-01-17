const sqlite = require("sqlite3");
const path = require("path");
const print = require("../utils/printer");

const DEFAULT_DB_PATH = path.join(__dirname, "db.db");

// glbal single access to the db
let db = null;
let counter = 1;

/**
 * open a connection with the database.
 * It closes any open connection
 * @param {String} path. Optional
 * @param {Promise} resolved if everything went well, rejected otherwise
 */
const open = (dbpath = DEFAULT_DB_PATH) => {
    return new Promise(async (res, rej) => {
        // close the previous connection if still open
        if (db) await close();

        // open new connection
        db = new sqlite.Database(dbpath, (err) => {
            if (err) rej(err);
            else res();
        });
    });
};

/**
 * close a connection with the database.
 * @param {Promise} resolved if everything went well, rejected otherwise
 */
const close = () => {
    return new Promise((res, rej) => {
        db.close((err) => {
            if (err) rej(err);
            else {
                db = null;
                res();
            }
        });
    });
};

/**
 * creates a insert query given an order
 * @param {Order} a order
 * @param {User} the requesting user
 * @param {String}
 */
const createQueryAddOrder = (order) => {
    const fields = Object.keys(order);

    let ingredientTuples = [];

    const values = [];
    for (const keys of Object.keys(order)) {
        if (keys !== "ingredients") {
            values.push(`"${order[keys]}"`);
        } else {
            for (const ingredient of order.ingredients) {
                ingredient.name = ingredient.name.toLowerCase();
                ingredientTuples.push(`(${Object.values(ingredient).join(", ")})`);
            }

            values.push(`"${ingredientTuples}"`);
        }
    }

    const sql = `INSERT INTO Orders(${fields.join(",")}, idorder) VALUES(${values.join(", ")}, ${counter++})`;
    return sql;
};

/**
 * utility funcion to save an order into the database
 * @param {Order} a order
 * @param {User} the requesting user
 * @param {Promise} resolved if everything went well, rejected otherwise
 */
const saveOrder = (order) => {
    const sqlQuery = createQueryAddOrder(order[0]);
    return new Promise((res, rej) => {
        console.log("executing", sqlQuery);
        db.run(sqlQuery, (err) => {
            if (err) {
                rej(err);
                return;
            }

            res();
        });
    });
};

/**
 * find a user given his email
 * @param {String} email
 * @param {Promise} User. An Error on error
 */
const findUserByEmail = (email) => {
    return new Promise((res, rej) => {
        const sql = "SELECT * FROM Users WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) {
                rej(err);
                return;
            }

            res(row);
        });
    });
};

module.exports = { open, close, saveOrder, findUserByEmail, createQueryAddOrder };
