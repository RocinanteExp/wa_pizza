import { factoryError, errno } from "../utils/error";
import constants from "../utils/constants";

function removeItemFromArray(array, index) {
    const ret = array.slice(0, index);
    ret.push(...array.slice(index + 1, array.length));
    return ret;
}

/**
 * @returns {Array} an array of a single element or an empty array
 */
function removeObjFromArrayInPlace(array, property, targetValue) {
    for (const [index, elem] of array.entries()) {
        if (elem[property] === targetValue) {
            array.splice(index, 1);
            return [elem];
        }
    }

    return [];
}

function addItemToArray(array, elem) {
    const ret = [...array, elem];
    return ret;
}

function validateOrder(orderItem) {
    const ret = {};

    if (orderItem.size === "") return { error: factoryError(errno.PIZZA_SIZE_EMPTY) };

    // check if the orderItem is empty
    if (orderItem.ingredients.length === 0) return { error: factoryError(errno.PIZZA_INGREDIENTS_EMPTY) };

    // check if the quantity is less than 1
    if (orderItem.quantity <= 0)
        return { error: factoryError(errno.PIZZA_QUANTITY_MINIMUM, { minQuantity: 1, size: orderItem.size }) };

    return ret;
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
function findObj(array, property, searchValue) {
    const ret = array.find((obj) => obj[property] === searchValue);
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
function indexOfObj(array, property, targetValue) {
    for (const [index, elem] of array.entries()) {
        if (elem[property] === targetValue) {
            return index;
        }
    }

    return -1;
}

function copyExistingProps(to, from) {
    Object.keys(from)
        .filter((key) => key in to)
        .forEach((key) => (to[key] = from[key]));
}

const exportsObj = {
    removeItemFromArray,
    addItemToArray,
    validateOrder,
    capitalize,
    containsObj,
    findObj,
    removeObjFromArrayInPlace,
    indexOfObj,
    copyExistingProps,
};

export default exportsObj;
