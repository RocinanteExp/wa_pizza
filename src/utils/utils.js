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

const exportsObj = { removeItemFromArray, addItemToArray };
export default exportsObj;
