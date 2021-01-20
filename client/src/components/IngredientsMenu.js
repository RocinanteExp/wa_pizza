import utils from "../utils/utils";
import { useState, useEffect } from "react";
import sys from "../utils/constants";
import { Dialog } from "./Dialog";
import { Container, ContainerFlex, Border } from "./Container";
import print from "../utils/printer";

/**
 * create ingredient menu
 * @param {Array} of String ingredients
 * @param {Function} handles.onChange
 * @param {Boolean} showIcons
 * @returns {Component} IngredientsMenu
 **/
const PizzaIngredientsMenu = ({ size, names, handles, maxPerSize }) => {
    // states
    const [numSelected, setNumSelected] = useState({ left: 0, right: 0, both: 0 });
    const [selectedItems, setSelectedItems] = useState([]);
    const [currSize, setCurrSize] = useState(size);
    const [errorItems, setErrorItems] = useState([]);

    const currComponentId = "id-container-pizza-ingredients-menu";
    const currComponentTitle = "Aggiungi Ingredienti!";

    const ingredientsName = [...names];
    const showIcons = size === sys.PIZZA_SIZES.LARGE ? true : false;
    const limits = maxPerSize;

    const ingredientsGroupedByInitials = groupByInitials(ingredientsName);

    const isAPossibleChoiceTick = () => {
        switch (currSize) {
            case sys.PIZZA_SIZES.SMALL:
            case sys.PIZZA_SIZES.MEDIUM: {
                return numSelected.both < limits.both;
            }
            case sys.PIZZA_SIZES.LARGE: {
                return numSelected.left + numSelected.right < limits.left + limits.right;
            }
            default: {
                console.group("default case in isAPossibleChoiceTick");
                console.error("currSize", currSize);
                console.groupEnd();
            }
        }

        return null;
    };

    const isAPossibleChoiceRadio = (oldSide, newSide) => {
        if (currSize === sys.PIZZA_SIZES.LARGE) {
            if (oldSide && oldSide !== newSide) {
                if (oldSide === "both") return true;
                else if (newSide === "both") {
                    if (oldSide === "left") return numSelected["right"] + 1 <= limits["right"];
                    else return numSelected["left"] + 1 <= limits["left"];
                } else if (newSide === "left") {
                    return numSelected.left + 1 <= limits.left;
                } else if (newSide === "right") {
                    return numSelected.right + 1 <= limits.right;
                } else {
                    console.log("ERROR: in isAPossibleChoiceRadio", oldSide, newSide);
                }
            } else if (!oldSide && newSide) {
                if (newSide === "both") {
                    return numSelected["left"] + 1 <= limits["left"] && numSelected["left"] + 1 <= limits["left"];
                } else if (newSide === "left") {
                    return numSelected.left + 1 <= limits.left;
                } else if (newSide === "right") {
                    return numSelected.right + 1 <= limits.right;
                } else {
                    console.log("ERROR: in isAPossibleChoiceRadio", oldSide, newSide);
                }
            }
        } else {
            console.group("default case in isAPossibleChoiceRadio");
            console.error("currSize", currSize);
            console.groupEnd();
        }
        return null;
    };

    // find the sides which must be updated in numSelected each time an ingredient has been tick/tick off
    // for small/medium pizza this side is always equal to both
    // for large pizza this could be: left, right or left+right (the latter is true is the side of the ingredient is both)
    const findSidesThatNeedUpdate = (ingredient) => {
        if (currSize === sys.PIZZA_SIZES.LARGE && ingredient.side === sys.PIZZA_SIDES.BOTH) {
            return [sys.PIZZA_SIDES.LEFT, sys.PIZZA_SIDES.RIGHT];
        }

        return [ingredient.side];
    };

    const opcode = {
        MINUS: 0,
        PLUS: 1,
        SWITCH: 2,
    };

    // utility function
    const updateNumSelected = (operation, ingredient, newIngredient) => {
        // find which sides of numSelected need to be updated
        const sidesToBeUpdated = findSidesThatNeedUpdate(ingredient);

        const opOnNumSelected = (side, op, quantity) => {
            switch (op) {
                case opcode.MINUS: {
                    return { [side]: numSelected[side] - quantity };
                }
                case opcode.PLUS: {
                    return { [side]: numSelected[side] + quantity };
                }
                default:
                    break;
            }
        };

        switch (operation) {
            case "delete": {
                // for each side create an object with obj.side = numSelected[side] - 1
                const updatedNumSelected = sidesToBeUpdated.map((side) => opOnNumSelected(side, opcode.MINUS, 1));

                // update the state of numSelected
                setNumSelected(() => Object.assign({}, numSelected, ...updatedNumSelected));
                break;
            }
            case "add": {
                // for each side create an object with obj.side = numSelected[side] + 1
                const updatedNumSelected = sidesToBeUpdated.map((side) => opOnNumSelected(side, opcode.PLUS, 1));

                // update the state of numSelected
                setNumSelected(() => Object.assign({}, numSelected, ...updatedNumSelected));

                break;
            }
            case "switch": {
                if (ingredient.side === sys.PIZZA_SIDES.BOTH) {
                    if (newIngredient.side === sys.PIZZA_SIDES.LEFT)
                        setNumSelected({ ...numSelected, ...opOnNumSelected(sys.PIZZA_SIDES.RIGHT, opcode.MINUS, 1) });
                    else if (newIngredient.side === sys.PIZZA_SIDES.RIGHT)
                        setNumSelected({ ...numSelected, ...opOnNumSelected(sys.PIZZA_SIDES.LEFT, opcode.MINUS, 1) });
                } else if (ingredient.side === sys.PIZZA_SIDES.LEFT) {
                    if (newIngredient.side === sys.PIZZA_SIDES.BOTH)
                        setNumSelected({ ...numSelected, ...opOnNumSelected(sys.PIZZA_SIDES.RIGHT, opcode.PLUS, 1) });
                    else if (newIngredient.side === sys.PIZZA_SIDES.RIGHT)
                        setNumSelected({
                            ...numSelected,
                            ...opOnNumSelected(sys.PIZZA_SIDES.LEFT, opcode.MINUS, 1),
                            ...opOnNumSelected(sys.PIZZA_SIDES.RIGHT, opcode.PLUS, 1),
                        });
                } else if (ingredient.side === sys.PIZZA_SIDES.RIGHT) {
                    if (newIngredient.side === sys.PIZZA_SIDES.BOTH)
                        setNumSelected({ ...numSelected, ...opOnNumSelected(sys.PIZZA_SIDES.LEFT, opcode.PLUS, 1) });
                    else if (newIngredient.side === sys.PIZZA_SIDES.LEFT)
                        setNumSelected({
                            ...numSelected,
                            ...opOnNumSelected(sys.PIZZA_SIDES.LEFT, opcode.PLUS, 1),
                            ...opOnNumSelected(sys.PIZZA_SIDES.RIGHT, opcode.MINUS, 1),
                        });
                } else {
                    print.err("case 'switch' not implemented in updatedNumSelected");
                }
                break;
            }
            default:
                print.err("not implemented in updatedNumSelected");
        }
    };

    const handleIngredientTick = (event) => {
        const isChecked = event.target.checked;
        const ingredientName = event.target.value;

        // give an warning if the pizza has not be choosen
        if (!size) {
            handles.onMessage({
                type: "info",
                message: "Seleziona la dimensione della pizza",
            });
            return;
        }

        // checking if a user need still to choose the side of the pizza
        if (isChecked) {
            for (const ingredient of selectedItems) {
                if (!ingredient.side) {
                    // check if the items is already in errorItems
                    // this can happen when you tick other ingredients
                    if (!utils.containsObj(errorItems, ingredient.name, "name"))
                        setErrorItems(utils.addItemToArray(errorItems, { name: ingredient.name }));

                    return;
                }
            }
        }

        // update the numSelected immediately if the pizza is either small or medium because
        // it is going to update always numSelected.both
        function shouldUpdateNumSelected() {
            if (currSize === sys.PIZZA_SIZES.SMALL || currSize === sys.PIZZA_SIZES.MEDIUM) return true;
            else if (currSize === sys.PIZZA_SIZES.LARGE) return false;
            else return null;
        }

        if (isChecked) {
            // check if the user can still choose more ingredients
            const isPossible = isAPossibleChoiceTick();
            if (!isPossible) {
                let maxIngredients = limits["both"];
                if (size === sys.PIZZA_SIZES.LARGE) {
                    maxIngredients = `${limits["left"]} sx`;
                    maxIngredients += `, ${limits["right"]} dx`;
                }

                handles.onMessage({
                    type: "info",
                    message: `Puoi selezionare fino a ${maxIngredients} ingredienti per una pizza ${size}`,
                });
                return;
            }

            if (shouldUpdateNumSelected()) {
                // case when pizza is small or medium
                // update numSelected
                setNumSelected(() => ({ ...numSelected, both: numSelected.both + 1 }));

                // update selectedItems
                const newSelectedItems = utils.addItemToArray(selectedItems, { name: ingredientName, side: "both" });
                setSelectedItems(newSelectedItems);

                // callback from parent container
                handles.onChange(newSelectedItems);
            } else {
                // pizza large

                // the ingredient just added to the selectedItems is missing the "side" property.
                // The side is taken care of in "handleChangeIcon" because the user has the faculty to select which side to put
                // the ingredient on
                const newSelectedItems = utils.addItemToArray(selectedItems, { name: ingredientName });
                setSelectedItems(newSelectedItems);
            }
        } else if (!isChecked) {
            const copySelectedItems = [...selectedItems];

            // remove item from selectedItems
            const deletedIngredients = utils.removeObjFromArrayInPlace(copySelectedItems, "name", ingredientName);

            if (deletedIngredients.length > 0) {
                const deletedIngredient = deletedIngredients[0];
                //print.grp("!isChecked");
                //print.out("removing ingredient", deletedIngredient);
                //print.grpend();

                setSelectedItems(copySelectedItems);

                // update parent state
                handles.onChange(copySelectedItems);

                // update numSelected
                // the ingredient may not have a side yet if the pizza size is LARGE and the ingredient is the last chosen
                if (deletedIngredient.side) {
                    updateNumSelected("delete", deletedIngredient);
                }
            }

            // remote item from errorItems
            // the ingredient may be in the errorItems
            // we could be in situation where the user tick and untick before he/she has choose the side of pizza in
            // case of a large pizza size
            const copyErrorItems = [...errorItems];
            const deletedErrorItems = utils.removeObjFromArrayInPlace(copyErrorItems, "name", ingredientName);

            if (deletedErrorItems.length > 0) {
                setErrorItems(copyErrorItems);
            }
        }
    };

    // called only when the pizza is large
    // when you click the icon of the pizza
    const handleChangeIcon = (event) => {
        const ingredientFields = event.target.value.split("-");

        // target ingredient
        const newIngredient = { name: utils.capitalize(ingredientFields[1]), side: ingredientFields[0] };
        //print.grp("handleChangeIcon");
        //print.out(newIngredient);
        //print.grpend();

        // remove item from selectedItems
        const foundIngredient = utils.findObj(selectedItems, "name", newIngredient.name);
        if (!foundIngredient) print.err("ingredient not found in the selectedItems from handleChangeIcon");

        const oldIngredient = { ...foundIngredient };

        //print.grp("isAPossibleChoiceRadio");
        // check if the chosen pizza's side selection is available
        if (!isAPossibleChoiceRadio(oldIngredient.side, newIngredient.side)) {
            //print.out("failed oldside:", oldIngredient.side, " => newside:", newIngredient.side);
            //print.grpend();

            let maxIngredients = `${limits["left"]} sx`;
            maxIngredients += `, ${limits["right"]} dx`;

            // set info message
            handles.onMessage({
                type: "info",
                message: `Per una pizza large puoi selezionare al massimo ${maxIngredients}`,
            });

            return;
        }

        //print.out("switched oldside:", oldIngredient.side, "=> newside:", newIngredient.side);
        //print.grpend();

        // update the numSelected items
        const doesHaveSide = oldIngredient.side ? true : false;

        // update the selected items
        if (doesHaveSide) {
            updateNumSelected("switch", oldIngredient, newIngredient);
        } else {
            updateNumSelected("add", newIngredient);
        }

        const indexSelectedItems = utils.indexOfObj(selectedItems, "name", newIngredient.name);
        const copySelectedItems = utils.removeItemFromArray(selectedItems, indexSelectedItems);

        copySelectedItems.push(newIngredient);

        setSelectedItems(copySelectedItems);

        // remote item from errorItems
        // the ingredient may be in the errorItems
        // the user has choose a side for the current ingredient
        const copyErrorItems = [...errorItems];
        const deletedErrorItems = utils.removeObjFromArrayInPlace(copyErrorItems, "name", newIngredient.name);

        if (deletedErrorItems.length > 0) {
            setErrorItems(copyErrorItems);
        }

        //update state parent
        handles.onChange(copySelectedItems);
    };

    useEffect(() => {
        // when size has been changed
        // restore the menu to default state when the pizza size has changed
        if (currSize !== size) {
            setCurrSize(size);
            setSelectedItems([]);
            setNumSelected({ left: 0, right: 0, both: 0 });
            setErrorItems([]);
            handles.onChange([]);
        }
        const printStates = () => {
            print.grp("States of PizzaIngredientsMenu");
            print.out("size", size);
            print.out("numSelected", numSelected);
            print.out("limits", limits);
            print.out("selectedItems");
            print.tb(selectedItems);
            print.out("errorItems");
            print.tb(errorItems);
            print.grpend();
        };

        printStates();
    }, [size, currSize, numSelected, errorItems, selectedItems, limits, handles]);

    return (
        <>
            <Container id={currComponentId} title={currComponentTitle}>
                {ingredientsGroupedByInitials.map((group) =>
                    createIngredientsGroup({
                        group,
                        handleChangeIcon,
                        handleIngredientTick,
                        errorItems,
                        showIcons,
                        selectedItems,
                    })
                )}
            </Container>
        </>
    );
};

const createPizzaIcons = ({ ingredientName, handleChangeIcon, radioChecked, isError }) => {
    const id = `id-container-icons-${ingredientName}`;
    const idRadioLeft = `id-radio-left-icons-${ingredientName}`;
    const idRadioCenter = `id-radio-center-icons-${ingredientName}`;
    const idRadioRight = `id-radio-right-icons-${ingredientName}`;
    const groupName = `group-radio-${ingredientName}`;

    const onChange = (event) => {
        handleChangeIcon(event);
    };

    return (
        <Border type={isError ? "error" : "none"}>
            <ContainerFlex id={id} crossAxis="center">
                <ContainerFlex>
                    <input
                        type="radio"
                        checked={radioChecked === "left"}
                        onChange={onChange}
                        id={idRadioLeft}
                        name={groupName}
                        value={`left-${ingredientName}`}
                        disabled={ingredientName === "frutti di mare"}
                    ></input>
                    <label htmlFor={idRadioLeft} className="left-half-circle bg-black toggle"></label>
                    <label htmlFor={idRadioLeft} className="right-half-circle bg-white"></label>
                </ContainerFlex>

                <ContainerFlex>
                    <input
                        type="radio"
                        checked={radioChecked === "both"}
                        onChange={onChange}
                        id={idRadioCenter}
                        name={groupName}
                        value={`both-${ingredientName}`}
                    ></input>
                    <label htmlFor={idRadioCenter} className="left-half-circle bg-black toggle"></label>
                    <label htmlFor={idRadioCenter} className="right-half-circle bg-black toggle"></label>
                </ContainerFlex>

                <ContainerFlex>
                    <input
                        type="radio"
                        checked={radioChecked === "right"}
                        onChange={onChange}
                        id={idRadioRight}
                        name={groupName}
                        value={`right-${ingredientName}`}
                        disabled={ingredientName === "frutti di mare"}
                    ></input>
                    <label htmlFor={idRadioRight} className="left-half-circle bg-white"></label>
                    <label htmlFor={idRadioRight} className="right-half-circle bg-black toggle"></label>
                </ContainerFlex>
                {isError ? <Dialog type="tooltip" message="Seleziona una parte" /> : null}
            </ContainerFlex>
        </Border>
    );
};

const CreateIngredientRow = ({
    ingredientName,
    handleIngredientTick,
    showIcons,
    tickChecked,
    radioChecked,
    handleChangeIcon,
    isError,
}) => {
    const id = `id-row-${ingredientName}`;
    const inputId = `id-input-${ingredientName}`;
    const key = `key-${ingredientName}`;

    const displayName = utils.capitalize(ingredientName);

    const onChange = (event) => {
        handleIngredientTick(event);
    };

    return (
        <ContainerFlex id={id} key={key} crossAxis="center">
            <input checked={tickChecked} id={inputId} value={displayName} type="checkbox" onChange={onChange}></input>
            <label className="container-flex flex-ca-center" style={{ minWidth: "max(50%, 20ch)" }} htmlFor={inputId}>
                {displayName}
            </label>
            {showIcons && tickChecked && createPizzaIcons({ ingredientName, handleChangeIcon, radioChecked, isError })}
        </ContainerFlex>
    );
};

function createIngredientsGroup({
    group,
    handleChangeIcon,
    handleIngredientTick,
    errorItems,
    showIcons,
    selectedItems,
}) {
    const initial = group[0].slice(0, 1).toUpperCase();
    const key = `key-group-initial-${initial}`;
    const id = `id-group-initial-${initial}`;

    return (
        <div key={key} id={id}>
            <div className="font size-m weight-bold">{initial}</div>
            {group.map((ingredientName) => {
                let tickChecked = false;
                let radioChecked = undefined;

                const names = selectedItems.map(function (e) {
                    return e.name;
                });

                const errornames = errorItems.map(function (e) {
                    return e.name;
                });

                if (names.includes(utils.capitalize(ingredientName))) {
                    tickChecked = true;
                }

                const ingredient = utils.findObj(selectedItems, "name", utils.capitalize(ingredientName));
                if (ingredient && ingredient.side) radioChecked = ingredient.side;

                let isError = false;
                if (errornames.includes(utils.capitalize(ingredientName))) isError = true;

                return CreateIngredientRow({
                    ingredientName,
                    handleChangeIcon,
                    handleIngredientTick,
                    showIcons,
                    tickChecked,
                    radioChecked,
                    isError,
                });
            })}
        </div>
    );
}

/**
 * group the ingredients by their initial
 * @param {Array} of String ingredients
 * @param {Array} of Function handlers
 * @returns {Array} of Array
 **/
function groupByInitials(ingredientsName) {
    const ret = [];

    // transform every word to lowercase
    const lowerCasedIngredients = ingredientsName.map((i) => i.toLowerCase());
    // sort the array
    lowerCasedIngredients.sort();

    let last = null;
    let group = [];
    for (const ingredient of lowerCasedIngredients) {
        const initial = ingredient.slice(0, 1);

        // a different letter means a new group
        if (initial !== last) {
            group = [];
            last = initial;
            ret.push(group);
        }

        group.push(ingredient);
    }

    return ret;
}

export { PizzaIngredientsMenu };
