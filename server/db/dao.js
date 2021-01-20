const sqlite = require("sqlite3");
const path = require("path");
const print = require("../utils/printer");

const DEFAULT_DB_PATH = path.join(__dirname, "db.db");

// glbal single access to the db
let db = null;
let globalCounterOrderId;

const getMaxOrderId = () => {
    const query = `SELECT MAX(orderId) as count FROM Orders`;

    return new Promise((res, rej) => {
        db.get(query, (error, row) => {
            if (error) rej(error);
            else res(row);
        });
    });
};

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
        db = new sqlite.Database(dbpath, async (err) => {
            if (err) rej(err);

            try {
                const { count } = await getMaxOrderId();
                globalCounterOrderId = count === null ? 0 : count + 1;
                res();
            } catch (err) {
                rej(err);
            }
        });

        db.on("profile", (query) => {
            query = query.replace(/ +(?= )/g, "");
            console.log("QUERY EXECUTED => ", query);
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

const normalizeValue = (value) => {
    switch (typeof value) {
        case "number":
            return value;
        case "string":
            return `"${value}"`;
        case "undefined":
            return null;
        case "object":
        default:
            print.err("normalizeValue default case");
    }
};

/**
 * creates a insert query given an order
 * @param {Order} a order
 * @param {User} the requesting user
 * @param {String}
 */
const generateAddOrderQuery = (order, userId) => {
    const queries = [];
    for (orderItem of order) {
        const fields = Object.keys(orderItem);

        let ingredientTuples = [];

        const values = [];
        for (const property of Object.keys(orderItem)) {
            if (property !== "ingredients") {
                values.push(normalizeValue(orderItem[property]));
            } else {
                for (const ingredient of orderItem.ingredients) {
                    ingredient.name = ingredient.name.toLowerCase();
                    ingredientTuples.push(`(${Object.values(ingredient).join(", ")})`);
                }

                values.push(`"${ingredientTuples}"`);
            }
        }

        const sql = `INSERT INTO Orders(${fields.join(", ")}, orderId, userId) VALUES(${values.join(
            ", "
        )}, ${globalCounterOrderId}, ${userId})`;

        queries.push(sql);
    }

    console.log(queries);
    globalCounterOrderId++;

    return queries;
};

const promisifyQueryRun = (query) => {
    return new Promise((res, rej) => {
        db.run(query, (error) => {
            if (error) rej(error);
            else res();
        });
    });
};

/**
 * utility funcion to save an order into the database
 * @param {Order} a order
 * @param {User} the requesting user
 * @param {Promise} resolved if everything went well, rejected otherwise
 */
const saveOrder = (order, userId) => {
    const sqlQueries = generateAddOrderQuery(order, userId);

    return new Promise((res, rej) => {
        db.serialize(async () => {
            db.run("BEGIN TRANSACTION;");

            try {
                await Promise.all(sqlQueries.map((query) => promisifyQueryRun(query)));

                db.run("COMMIT;", (err) => {
                    if (err) rej(err);
                    else res();
                });
            } catch (err) {
                db.run("ROLLBACK TRANSACTION;", (err) => {
                    if (err) rej(err);
                    else res();
                });
            }
        });
    });
};

/**
 * utility funcion to save an order into the database
 * @param {Object} a order
 * @param {User} the requesting user
 * @param {Promise}
 */
const updatePizzaAvailabilities = (availabilities) => {
    const query = "UPDATE PizzaAvailabilities SET small = ?, medium = ?, large = ?";

    return new Promise((res, rej) => {
        db.run(query, [availabilities.small, availabilities.medium, availabilities.large], (error) => {
            if (error) rej(error);
            else res();
        });
    });
};

/**
 * find a user given his email
 * @param {String} email
 * @param {Promise} User. An Error on error
 */
const getUserByEmail = (email) => {
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

/**
 * get all orders given an User
 * @param {Integer} userId
 * @param {Promise} orders. An Error on error
 */
const getOrdersByUserId = (userId) => {
    return new Promise((res, rej) => {
        const sql = "SELECT * FROM Orders WHERE userId IS ?";

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            res(rows);
        });
    });
};

/**
 * get the availabilities per pizza
 * @param {Promise}
 */
const getPizzaAvailabilities = () => {
    return new Promise((res, rej) => {
        const sql = "SELECT * FROM PizzaAvailabilities";

        db.get(sql, (err, row) => {
            if (err) {
                rej(err);
                return;
            }

            res(row);
        });
    });
};

module.exports = {
    close,
    generateAddOrderQuery,
    getOrdersByUserId,
    getPizzaAvailabilities,
    getUserByEmail,
    open,
    saveOrder,
    updatePizzaAvailabilities,
};
