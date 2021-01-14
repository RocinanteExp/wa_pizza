import { factoryError, errno } from "../utils/error";
import constants from "../utils/constants";

function removeItemFromArray(array, index) {
    const ret = array.slice(0, index);
    ret.push(...array.slice(index + 1, array.length));
    return ret;
}

function addItemToArray(array, index) {
    const ret = array.slice();
    ret.push(index);
    return ret;
}

function validateOrder(order) {
    console.log(order);
    const maxQuantity = constants.PIZZA_MAX_QUANTITIES[order.size];
    if (order.ingredients.length === 0) return { error: factoryError(errno.PIZZA_INGREDIENTS_EMPTY) };
    if (order.quantity > maxQuantity)
        return { error: factoryError(errno.PIZZA_QUANTITY_EXCEEDED, [order.quantity, maxQuantity]) };
    return {};
}

function capitalize(str) {
    if (typeof str !== "string") return undefined;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if exists an obj with obj[property] === searchValue inside array
 *
 *@param {Array} of Objects
 *@param {Any}
 *@param {String} 
 *@returns {Boolean}
 **/
function containsObj(array, searchValue, property) {
    const ret = array.some((obj) => obj[property] === searchValue);
    return ret;
}

/**
 * Find an obj with obj[property] === searchValue inside array
 *
 *@param {Array} of Objects
 *@param {Any}
 *@param {String} 
 *@returns {Object}
 **/
function findObj(array, searchValue, property) {
    const ret = array.find((obj) => obj[property] === searchValue);
    return ret;
}

const exportsObj = { removeItemFromArray, addItemToArray, validateOrder, capitalize, containsObj, findObj };

export default exportsObj;
