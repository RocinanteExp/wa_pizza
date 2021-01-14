import utils from "../utils/utils";
import { useState, useEffect } from "react";
import sys from "../utils/constants";
import checker from "../utils/checker";

const Message = ({ text, type }) => {
    const style = {
        position: "sticky",
        marginLeft: "1rem",
        top: "1rem",
        left: "1rem",
        backgroundColor: "white",
        zIndex: "2",
    };
    if (!type) return null;

    return (
        <div style={style} className={`message-${type} text-center`}>
            {text}
        </div>
    );
};

/**
 * create ingredient menu
 * @param {Array} of String ingredients
 * @param {Function} handleOnChange
 * @param {Boolean} showIcons
 * @returns {Component} IngredientsMenu
 **/
const PizzaIngredientsMenu = ({ ingredients, handleOnChange, size }) => {
    const currComponentId = "id-pizza-ingredients-menu";
    const currComponentTitle = "Aggiungi Ingredienti!";

    const showIcons = size === sys.PIZZA_SIZES.LARGE ? true : false;
    const limits = sys.PIZZA_MAX_INGREDIENTS[sys.PIZZA_SIZES.LARGE];

    // states
    const [selectedItems, setSelectedItems] = useState([]);
    const [errorItems, setErrorItems] = useState([]);
    const [numSelected, setNumSelected] = useState({ left: 0, right: 0, both: 0 });
    const [currSize, setCurrSize] = useState(size);
    const [message, setMessage] = useState({});

    const ingredientsGroupedByInitials = groupByInitials(ingredients);

    const style = {
        overflowY: "auto",
        height: "400px",
        scrollbarWidth: "thin",
        marginBottom: "1.5rem",
    };

    const isPossibleChoice = (oldSide, newSide) => {
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
                        console.log("ERROR: in isPossibleChoice", oldSide, newSide);
                    }
                } else if (!oldSide && newSide) {
                    if (newSide === "both") {
                        return numSelected["left"] + 1 <= limits["left"] && numSelected["left"] + 1 <= limits["left"];
                    } else if (newSide === "left") {
                        return numSelected.left + 1 <= limits.left;
                    } else if (newSide === "right") {
                        return numSelected.right + 1 <= limits.right;
                    } else {
                        console.log("ERROR: in isPossibleChoice", oldSide, newSide);
                    }
                }
                return numSelected.left + numSelected.right < limits.left + limits.right;
            }
            default: {
                console.group("default case in isPossibleChoice");
                console.log("currSize", currSize);
                console.groupEnd();
            }
        }

        return null;
    };

    const handleIngredientTick = (event) => {
        const isChecked = event.target.checked;

        // checking if a user need still to choose the side of the pizza
        if (isChecked) {
            for (const ingredient of selectedItems) {
                if (!ingredient.side) {
                    if (!utils.containsObj(errorItems, ingredient.name, "name"))
                        setErrorItems(utils.addItemToArray(errorItems, { name: ingredient.name }));

                    return;
                }
            }
        }

        function shouldUpdateNumSelected() {
            if (currSize === sys.PIZZA_SIZES.SMALL || currSize === sys.PIZZA_SIZES.MEDIUM) return true;
            else if (currSize === sys.PIZZA_SIZES.LARGE) return false;
            else return null;
        }

        const ingredientName = event.target.value;
        if (isChecked) {
            // check if the user can still choose more ingredients
            // const isPossible = isPossibleChoice(limits, numSelected);
            const isPossible = isPossibleChoice();
            if (!isPossible) {
                setMessage({
                    type: "info",
                    text: `Il numero massimo di ingredienti per ${size} è stata raggiunta ${limits["both"]}`,
                });
                return;
            }

            // add ingredient to selectedItems
            if (shouldUpdateNumSelected()) {
                // if the pizza's size is small or medium, update also the side count
                setNumSelected(() => ({ ...numSelected, both: numSelected.both + 1 }));
                const newSelectedItems = utils.addItemToArray(selectedItems, { name: ingredientName, side: "both" });
                setSelectedItems(newSelectedItems);
                handleOnChange(newSelectedItems);
            } else {
                // pizza side LARGE
                const newSelectedItems = utils.addItemToArray(selectedItems, { name: ingredientName });
                setSelectedItems(newSelectedItems);
            }
        } else if (!isChecked) {
            // remove item from selectedItems
            const indexSelectedItems = selectedItems.map((e) => e.name).indexOf(ingredientName);
            if (indexSelectedItems >= 0) {
                const ingredientToBeRemoved = selectedItems[indexSelectedItems];
                console.group("!isChecked");
                console.log("removing ingredient", ingredientToBeRemoved);
                console.groupEnd();

                const newSelectedItems = utils.removeItemFromArray(selectedItems, indexSelectedItems);
                setSelectedItems(newSelectedItems);
                handleOnChange(newSelectedItems);

                // update numSelected
                // the ingredient may not have a side yet if the pizza size is LARGE and the ingredient is the last chosen
                if (ingredientToBeRemoved.side) {
                    if (size === sys.PIZZA_SIZES.LARGE) {
                        console.group(`update pizza ${size} numSelected`);
                        console.log(
                            `${ingredientToBeRemoved.side} => curr value ${numSelected[ingredientToBeRemoved.side]}`
                        );
                        console.groupEnd();
                        if (ingredientToBeRemoved.side === "both") {
                            setNumSelected(() => ({
                                ...numSelected,
                                right: numSelected["left"] - 1,
                                left: numSelected["right"] - 1,
                            }));
                        } else {
                            setNumSelected(() => ({
                                ...numSelected,
                                [ingredientToBeRemoved.side]: numSelected[ingredientToBeRemoved.side] - 1,
                            }));
                        }
                    } else {
                        setNumSelected(() => ({
                            ...numSelected,
                            [ingredientToBeRemoved.side]: numSelected[ingredientToBeRemoved.side] - 1,
                        }));
                    }
                }
            }

            // remote item from errorItems
            // the ingredient may be in the errorItems if the pizza size is LARGE and the ingredient is the last chosen
            const indexErrorItems = errorItems.map((e) => e.name).indexOf(ingredientName);

            if (indexErrorItems >= 0) {
                const newErrorItems = utils.removeItemFromArray(errorItems, indexErrorItems);
                setErrorItems(newErrorItems);
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

        console.group("sono handleChangeIcon");
        console.log("name:", ingredientName, "side:", sidePizza);
        console.log("ingredientObj:", targetIngredient);
        console.groupEnd();

        console.group("isPossible choice");
        // check if the chosen pizza's side selection is available
        if (!isPossibleChoice(targetIngredient.side, sidePizza)) {
            console.log("oldside:", targetIngredient.side, "newside:", sidePizza);
            console.log(false);
            console.groupEnd();

            // set info message
            setMessage({
                type: "info",
                text: `Il numero massimo di ingredienti per ${sidePizza} è stata raggiunta ${limits[sidePizza]}`,
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
        // restore the menu to default state when the pizza size has changed
        if (currSize !== size) {
            setCurrSize(size);
            setSelectedItems([]);
            setNumSelected({ left: 0, right: 0, both: 0 });
            setErrorItems([]);
            handleOnChange([]);
        }
        const printStates = () => {
            console.group("useEffect of PizzaIngredientsMenu");
            console.log("numSelected", size);
            console.log("numSelected", numSelected);
            console.log("limits", limits);
            console.log("selectedItems", selectedItems);
            console.log("errorItems", errorItems);
            console.groupEnd();
        };

        if (!checker.isObjEmpty(message)) {
            (() => setTimeout(() => setMessage({}), 1000))();
        }

        printStates();
    }, [size, currSize, numSelected, errorItems, selectedItems, limits, message]);

    return (
        <div id={currComponentId} className="" style={style}>
            <div className="container">
                <Message {...message} />
                <h1>{currComponentTitle}</h1>
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
            </div>
        </div>
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
    console.log("radioChecked", radioChecked);

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
