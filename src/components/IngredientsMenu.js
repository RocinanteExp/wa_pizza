import utils from "../utils/utils";
import { useState, useEffect } from "react";
import sys from "../utils/constants";
import checker from "../utils/checker";
import Dialog from "./Dialog";
import Container from "./Container";
import print from "../utils/printer";

/**
 * create ingredient menu
 * @param {Array} of String ingredients
 * @param {Function} handleOnChange
 * @param {Boolean} showIcons
 * @returns {Component} IngredientsMenu
 **/
const PizzaIngredientsMenu = ({ ingredients, handleOnChange, size }) => {
    const currComponentId = "id-container-pizza-ingredients-menu";
    const currComponentTitle = "Aggiungi Ingredienti!";

    const showIcons = size === sys.PIZZA_SIZES.LARGE ? true : false;
    const limits = sys.PIZZA_MAX_INGREDIENTS[size];

    // states
    const [numSelected, setNumSelected] = useState({ left: 0, right: 0, both: 0 });
    const [selectedItems, setSelectedItems] = useState([]);
    const [errorItems, setErrorItems] = useState([]);
    const [currSize, setCurrSize] = useState(size);
    const [message, setMessage] = useState({});

    const ingredientsGroupedByInitials = groupByInitials(ingredients);

    const style = {
        overflowY: "auto",
        height: "min(800px, 50vh)",
        scrollbarWidth: "thin",
        marginBottom: "1.5rem",
    };

    const isAPossibleChoice = (oldSide, newSide) => {
        switch (currSize) {
            case sys.PIZZA_SIZES.SMALL:
            case sys.PIZZA_SIZES.MEDIUM: {
                return numSelected.both < limits.both;
            }
            case sys.PIZZA_SIZES.LARGE: {
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
                        console.log("ERROR: in isAPossibleChoice", oldSide, newSide);
                    }
                } else if (!oldSide && newSide) {
                    if (newSide === "both") {
                        return numSelected["left"] + 1 <= limits["left"] && numSelected["left"] + 1 <= limits["left"];
                    } else if (newSide === "left") {
                        return numSelected.left + 1 <= limits.left;
                    } else if (newSide === "right") {
                        return numSelected.right + 1 <= limits.right;
                    } else {
                        console.log("ERROR: in isAPossibleChoice", oldSide, newSide);
                    }
                }
                return numSelected.left + numSelected.right < limits.left + limits.right;
            }
            default: {
                console.group("default case in isAPossibleChoice");
                console.error("currSize", currSize);
                console.groupEnd();
            }
        }

        return null;
    };

    const handleIngredientTick = (event) => {
        const isChecked = event.target.checked;
        const ingredientName = event.target.value;

        // give an warning if the pizza has not be choosen
        if (!size) {
            setMessage({
                type: "warning",
                message: `Scegli prima la dimensione della pizza`,
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

        // find the sides which must be updated in numSelected each time an ingredient has been tick/tick off
        // for small/medium pizza this side is always equal to both
        // for large pizza this could be: left, right or left+right (the latter is true is the side of the ingredient is both)
        const findSidesThatNeedUpdate = (ingredient) => {
            if (currSize === sys.PIZZA_SIZES.LARGE && ingredient.side === sys.PIZZA_SIDES.BOTH) {
                return [sys.PIZZA_SIDES.LEFT, sys.PIZZA_SIDES.RIGHT];
            }
 
            return [ingredient.side];
        };

        const updateNumSelected = (fromState, ingredient) => {
            switch (fromState) {
                case "delete": {
                    // find which sides of numSelected need to be updated
                    const sidesToBeUpdated = findSidesThatNeedUpdate(ingredient);

                    // for each side create an object with obj.side = numSelected[side] - 1
                    const updatedNumSelected = sidesToBeUpdated.map((side) => ({ [side]: numSelected[side] - 1 }));

                    // update the state of numSelected
                    setNumSelected(() => Object.assign({}, numSelected, ...updatedNumSelected));
                    break;
                }
                default:
                    print.err("not implemented in updatedNumSelected");
            }
        };

        // update the numSelected immediately if the pizza is either small or medium because
        // it is going to update always numSelected.both
        function shouldUpdateNumSelected() {
            if (currSize === sys.PIZZA_SIZES.SMALL || currSize === sys.PIZZA_SIZES.MEDIUM) return true;
            else if (currSize === sys.PIZZA_SIZES.LARGE) return false;
            else return null;
        }

        if (isChecked) {
            // check if the user can still choose more ingredients
            const isPossible = isAPossibleChoice();
            if (!isPossible) {
                setMessage({
                    type: "warning",
                    message: `Puoi selezionare fino a ${Object.values(limits)} ingredienti per la pizza ${size}`,
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
                handleOnChange(newSelectedItems);
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
                print.grp("!isChecked");
                print.out("removing ingredient", deletedIngredient);
                print.grpend();

                setSelectedItems(copySelectedItems);

                // update parent state
                handleOnChange(copySelectedItems);

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
        // TODO handle splits of multi-words => now the ids are represented with a space "both-frutti di mare"
        const sidePizza = event.target.value.split("-")[0];
        const ingredientName = utils.capitalize(event.target.value.split("-")[1]);

        const indexSelectedItems = selectedItems.map((e) => e.name).indexOf(ingredientName);
        if (indexSelectedItems < 0)
            console.log("ERROR: ingredient not found in the selectedItems from handleChangeIcon");

        const targetIngredient = { ...selectedItems[indexSelectedItems] };

        print.grp("sono handleChangeIcon");
        print.out("name:", ingredientName, "side:", sidePizza);
        print.out("ingredientObj:", targetIngredient);
        print.grpend();

        console.group("isPossible choice");
        // check if the chosen pizza's side selection is available
        if (!isAPossibleChoice(targetIngredient.side, sidePizza)) {
            console.log("oldside:", targetIngredient.side, "newside:", sidePizza);
            console.log(false);
            console.groupEnd();

            // set info message
            setMessage({
                type: "info",
                message: `Il numero massimo di ingredienti per ${sidePizza} è stata raggiunta ${limits[sidePizza]}`,
            });
            return;
        } else {
            console.log("oldside:", targetIngredient.side, "newside:", sidePizza);
            console.log(true);
        }
        console.groupEnd();

        // update the numSelected items
        const isNewIngredient = targetIngredient.side ? false : true;
        // update the selected items
        if (isNewIngredient) {
            if (sidePizza === "both") {
                setNumSelected({ ...numSelected, right: numSelected["right"] + 1, left: numSelected["left"] + 1 });
            } else {
                setNumSelected({ ...numSelected, [sidePizza]: numSelected[sidePizza] + 1 });
            }
        } else {
            if (targetIngredient.side === "both") {
                if (sidePizza === "both") return;
                else if (sidePizza === "left") setNumSelected({ ...numSelected, right: numSelected["right"] - 1 });
                else if (sidePizza === "right") setNumSelected({ ...numSelected, left: numSelected["left"] - 1 });
            } else if (targetIngredient.side === "left") {
                if (sidePizza === "both") setNumSelected({ ...numSelected, right: numSelected["right"] + 1 });
                else if (sidePizza === "left") return;
                else if (sidePizza === "right")
                    setNumSelected({ ...numSelected, left: numSelected["left"] + 1, right: numSelected["right"] - 1 });
            } else if (targetIngredient.side === "right") {
                if (sidePizza === "both") setNumSelected({ ...numSelected, left: numSelected["left"] + 1 });
                else if (sidePizza === "left")
                    setNumSelected({ ...numSelected, right: numSelected["right"] - 1, left: numSelected["left"] + 1 });
                else if (sidePizza === "right") return;
            }
        }

        targetIngredient.side = sidePizza;

        const newSelectedItems = utils.removeItemFromArray(selectedItems, indexSelectedItems);
        newSelectedItems.push(targetIngredient);
        setSelectedItems(newSelectedItems);
        handleOnChange(newSelectedItems);

        // update the error list
        const indexErrorItems = errorItems.map((e) => e.name).indexOf(ingredientName);
        if (indexErrorItems >= 0) {
            const newErrorItems = utils.removeItemFromArray(selectedItems, indexErrorItems);
            setErrorItems(newErrorItems);
        }
    };

    useEffect(() => {
        // when size has been changed
        // restore the menu to default state when the pizza size has changed
        if (currSize !== size) {
            setCurrSize(size);
            setSelectedItems([]);
            setNumSelected({ left: 0, right: 0, both: 0 });
            setErrorItems([]);
            handleOnChange([]);
        }
        const printStates = () => {
            console.group("States of PizzaIngredientsMenu");
            console.log("size", size);
            console.log("numSelected", numSelected);
            console.log("limits", limits);
            console.log("selectedItems");
            console.table(selectedItems);
            console.log("errorItems");
            console.table(errorItems);
            console.groupEnd();
        };

        if (!checker.isObjEmpty(message)) {
            (() => setTimeout(() => setMessage({}), 1500))();
        }

        printStates();
    }, [size, currSize, numSelected, errorItems, selectedItems, limits, message, handleOnChange]);

    return (
        //<div id={currComponentId} className="" style={style}>
        <Container id={currComponentId} title={currComponentTitle}>
            <Dialog {...message} />
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
        //</div>
    );
};

const createPizzaIcons = ({ ingredientName, handleChangeIcon, radioChecked }) => {
    const style = {
        width: "1.25rem",
        height: "1.25rem",
        borderRadius: "50%",
        backgroundColor: "green",
    };

    const id = `id-container-icons-${ingredientName}`;
    const idRadioLeft = `id-radio-left-icons-${ingredientName}`;
    const idRadioCenter = `id-radio-center-icons-${ingredientName}`;
    const idRadioRight = `id-radio-right-icons-${ingredientName}`;
    const groupName = `group-radio-${ingredientName}`;

    const onChange = (event) => {
        //console.log("sono radio");
        //console.log(event.target.checked);
        //console.log(event.target.value);
        handleChangeIcon(event);
    };

    return (
        <div id={id} className="container-flex flex-cross-center">
            <div className="container-flex pos-relative">
                <input
                    type="radio"
                    checked={radioChecked === "left"}
                    onChange={onChange}
                    id={idRadioLeft}
                    name={groupName}
                    value={`left-${ingredientName}`}
                ></input>
                <label htmlFor={idRadioLeft} className="left-half-circle bg-black toggle"></label>
                <label htmlFor={idRadioLeft} className="right-half-circle bg-white"></label>
            </div>

            <div className="container-flex pos-relative">
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
            </div>

            <div className="container-flex pos-relative">
                <input
                    type="radio"
                    checked={radioChecked === "right"}
                    onChange={onChange}
                    id={idRadioRight}
                    name={groupName}
                    value={`right-${ingredientName}`}
                ></input>
                <label htmlFor={idRadioRight} className="left-half-circle bg-white"></label>
                <label htmlFor={idRadioRight} className="right-half-circle bg-black toggle"></label>
            </div>
        </div>
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
    const [isChecked, setIsChecked] = useState(false);

    const displayName = utils.capitalize(ingredientName);

    const onChange = (event) => {
        handleIngredientTick(event);
    };

    useEffect(() => {
        //console.log("rendering", isChecked, checkit);
        setIsChecked(tickChecked);
    }, [tickChecked, isChecked]);

    return (
        <div id={id} key={key} className="container-flex flex-cross-center flex-main-sb pos-relative">
            <input checked={isChecked} id={inputId} value={displayName} type="checkbox" onChange={onChange}></input>
            <label className="container-flex flex-cross-center" htmlFor={inputId}>
                {displayName}
            </label>
            {showIcons && isChecked && createPizzaIcons({ ingredientName, handleChangeIcon, radioChecked })}
            {isError && <div>ERRORE</div>}
        </div>
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
    const key = `group-key-initial-${initial}`;
    const id = `group-id-initial-${initial}`;

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

                const ingredient = utils.findObj(selectedItems, utils.capitalize(ingredientName), "name");
                if (ingredient && ingredient.side) radioChecked = ingredient.side;
                //console.group("group radio checked");
                //console.log(ingredient, radioChecked);
                //console.groupEnd();

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
function groupByInitials(ingredients) {
    const ret = [];

    // transform every word to lowercase
    const lowerCasedIngredients = ingredients.map((i) => i.toLowerCase());
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
