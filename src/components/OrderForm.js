import "../styles/App.css";
import { useState, useEffect } from "react";
import { IngredientsMenu } from "./IngredientsMenu";
import { Counter } from "./Counter";
import utils from "../utils/utils";
import constants from "../utils/constants";
import { factoryError, errno } from "../utils/error";

function orderValidator(order) {
    console.log(order);
    const maxQuantity = constants.PIZZA_MAX_QUANTITIES[order.size];
    if (order.ingredients.length === 0) return { error: factoryError(errno.PIZZA_INGREDIENTS_EMPTY) };
    if (order.quantity > maxQuantity) return { error: factoryError(errno.PIZZA_QUANTITY_EXCEEDED, [order.quantity, maxQuantity]) };
    return {};
}

const createButtons = (name, classes, handleClick) => {
    const key = `key-btn-${name}`;

    return (
        <button key={key} className={`${classes.join(" ")}`} onClick={() => handleClick(name)}>
            {name}
        </button>
    );
};

const PizzaIngredients = ({ handleOnChange, ingredients }) => {
    const style = {
        overflowY: "auto",
        height: "400px",
        scrollbarWidth: "thin",
        marginBottom: "1.5rem",
    };

    return (
        <div id="TODO" className="container-flex" style={style}>
            <IngredientsMenu
                name={"Aggiungi Ingredienti!"}
                id={`id-table-ingredients`}
                ingredients={ingredients}
                handleOnChange={handleOnChange}
            />
        </div>
    );
};

const PizzaSize = ({ sizes, setPizzaSize }) => {
    const neededButtons = sizes.slice();
    const baseButtonClasses = ["btn", "btn-dark", "btn-not-active"];
    const [activeButtonIndex, setActiveButtonIndex] = useState(1);

    useEffect(() => {
        setPizzaSize(neededButtons[activeButtonIndex]);
    });

    const handleClick = (buttonName) => {
        const indexOf = neededButtons.indexOf(buttonName);
        if (indexOf !== activeButtonIndex) {
            setActiveButtonIndex(indexOf);
            setPizzaSize(neededButtons[indexOf]);
        }
    };

    return (
        <div className="pizza-size-container margin-bottom">
            <h1>Dimensione pizza</h1>
            <div className="container-flex">
                {neededButtons.map((buttonName, index) => {
                    const classes = index === activeButtonIndex ? baseButtonClasses.slice(0, 2) : baseButtonClasses;
                    return createButtons(buttonName, classes, handleClick);
                })}
            </div>
        </div>
    );
};

const PizzaRequests = ({ setPizzaRequests }) => {
    const id = "id-container-requests";
    const styles = { marginBottom: "1.5rem" };

    const handleChange = (event) => {
        if (event.target.checked) setPizzaRequests(event.target.value);
        else setPizzaRequests(undefined);
    };

    return (
        <div id={id} style={styles}>
            <h1>Richieste</h1>
            <div className="container-flex">
                <input id="input-id-senza-pomodoro" value="Pomodoro" type="checkbox" onChange={handleChange} />
                <label
                    className="container-flex flex-cross-center"
                    htmlFor="input-id-senza-pomodoro"
                    style={{ width: "100%" }}
                >
                    Senza pomodoro
                </label>
            </div>
        </div>
    );
};

const PizzaQuantity = ({ setPizzaQuantity }) => {
    const id = "id-container-quantity";
    const styles = { marginBottom: "1.5rem" };
    return (
        <div id={id} style={styles}>
            <h1>Quantità</h1>
            <Counter callback={(quantity) => setPizzaQuantity(quantity)} />
        </div>
    );
};

// the ingredient's name must be unique
const OrderForm = ({ templateForm, handleOrderSubmit }) => {
    const { sizes, ingredients, requests, quantity } = templateForm;
    const [pizzaSize, setPizzaSize] = useState("");
    const [pizzaIngredients, setPizzaIngredients] = useState([]);
    const [pizzaRequests, setPizzaRequests] = useState(undefined);
    const [pizzaQuantity, setPizzaQuantity] = useState(-1);

    const handleOnChangeIngredients = (ingredient, status) => {
        let newPizzaIngredients = [];
        // add ingredient to pizzaIngredients
        if (status) {
            newPizzaIngredients = pizzaIngredients.slice();
            newPizzaIngredients.push(ingredient);
        } else {
            // delete ingredient to pizzaIngredients
            const indexIngredient = pizzaIngredients.indexOf(ingredient);
            newPizzaIngredients = utils.removeItemFromArray(pizzaIngredients, indexIngredient);
        }
        setPizzaIngredients(newPizzaIngredients);
        console.log(newPizzaIngredients);
    };

    const onButtonSubmit = () => {
        const order = {
            size: pizzaSize,
            quantity: pizzaQuantity,
            requests: pizzaRequests,
            ingredients: pizzaIngredients,
        };
        const { error } = orderValidator(order);
        console.log(error);
        if(!error) handleOrderSubmit(order);
    };

    return (
        <div id="id-order-form" className="container-small">
            <PizzaSize sizes={sizes} {...{ setPizzaSize }} />
            <PizzaIngredients ingredients={ingredients} handleOnChange={handleOnChangeIngredients} />
            <PizzaRequests {...{ setPizzaRequests }} />
            <PizzaQuantity {...{ setPizzaQuantity }} />
            <button id="id-btn-aggiungi" onClick={onButtonSubmit} className="btn btn-submit">
                Aggiungi
            </button>
        </div>
    );
};


export { OrderForm };
// OLD CODE
//const [selectedIngredients, setSelectedIngredients] = useState([]);
//const [availableIngredients, setAvailableIngredients] = useState(BASE_INGREDIENTS);

//const tableIds = { taken: "key-table-taken", notTaken: "key-table-not-taken" };

//useEffect(() => {
//    setPizzaIngredients(selectedIngredients);
//}, [selectedIngredients]);

//const handleClick = (ingredientKey, from) => {
//    const [takeFrom, takeFromFunc] =
//        from === tableIds.taken
//            ? [selectedIngredients, setSelectedIngredients]
//            : [availableIngredients, setAvailableIngredients];

//    const [addTo, addToFunc] =
//        from === tableIds.taken
//            ? [availableIngredients, setAvailableIngredients]
//            : [selectedIngredients, setSelectedIngredients];

//    const ingredientName = ingredientKey.split("key-")[0];

//    const index = takeFrom.indexOf(ingredientName);
//    const newTakeFrom = utils.removeItemFromArray(takeFrom, index);

//    const newAddTo = utils.addItemToArray(addTo, ingredientName);

//    takeFromFunc(newTakeFrom);
//    addToFunc(newAddTo);
//};
