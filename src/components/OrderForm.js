import "../styles/App.css";
import { useState, useEffect } from "react";
import { PizzaIngredientsMenu } from "./IngredientsMenu";
import { Counter } from "./Counter";
import Container from "./Container";
import sys from "../utils/constants";
import utils from "../utils/utils";

const createButtons = ({ name, classesArray, handleClick, text }) => {
    const key = `key-btn-${name}`;

    return (
        <button key={key} className={`${classesArray.join(" ")}`} onClick={() => handleClick(name)}>
            {text}
        </button>
    );
};

const PizzaSize = ({ sizes, handlerOnChange }) => {
    const currComponentId = "id-container-pizza-size";
    const currComponentTitle = "Dimensione Pizza";

    const baseButtonClasses = ["btn", "btn-dark", "btn-not-active"];
    const buttonsName = [...sizes];

    const maxQuantityPerSize = sys.PIZZA_MAX_QUANTITIES;

    const [activeButton, setActiveButton] = useState("");

    useEffect(() => {
        console.group("states of PizzaSize");
        console.log("active button => ", activeButton);
        console.groupEnd();
        handlerOnChange(activeButton);
    });

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <Container id={currComponentId} title={currComponentTitle} className="pizza-size-container margin-bottom">
            <div className="container-flex">
                {buttonsName.map((name) => {
                    const classesArray = name === activeButton ? baseButtonClasses.slice(0, 2) : baseButtonClasses;
                    const text = `${name} ${maxQuantityPerSize[name]}`;
                    return createButtons({ name, classesArray, handleClick, text });
                })}
            </div>
        </Container>
    );
};

const PizzaRequests = ({ setPizzaRequests }) => {
    const currComponentId = "id-container-pizza-requests";
    const currComponentTitle = "Richieste";
    const styles = { marginBottom: "1.5rem" };

    const handleChange = (event) => {
        if (event.target.checked) setPizzaRequests(event.target.value);
        else setPizzaRequests(undefined);
    };

    return (
        <Container id={currComponentId} title={currComponentTitle} style={styles}>
            <div className="container-flex">
                <input id="input-id-senza-pomodoro" value="senza-pomodoro" type="checkbox" onChange={handleChange} />
                <label
                    className="container-flex flex-cross-center"
                    htmlFor="input-id-senza-pomodoro"
                    style={{ width: "100%" }}
                >
                    Senza pomodoro
                </label>
            </div>
        </Container>
    );
};

const PizzaQuantity = ({ handlerOnChange, size }) => {
    const MAX_QUANTITY = sys.PIZZA_MAX_QUANTITIES[size];
    const MIN_QUANTITY = 1;

    const currComponentId = "id-container-pizza-quantity";
    const currComponentTitle = "Quantità";

    const styles = { marginBottom: "1.5rem" };

    return (
        <div id={currComponentId} style={styles}>
            <h1>{currComponentTitle}</h1>
            <Counter min={MIN_QUANTITY} max={MAX_QUANTITY} callback={(quantity) => handlerOnChange(quantity)} />
        </div>
    );
};

// the ingredient's name must be unique
const OrderForm = ({ templateForm, handleOrderSubmit }) => {
    const currComponentId = "id-order-form";
    const buttonSubmitId = "id-btn-aggiungi";

    const { sizes, ingredients } = templateForm;
    const [pizzaSize, setPizzaSize] = useState("");
    const [pizzaIngredients, setPizzaIngredients] = useState([]);
    const [pizzaRequests, setPizzaRequests] = useState(undefined);
    const [pizzaQuantity, setPizzaQuantity] = useState(-1);

    // handler for PizzaIngredients component
    // @param {String} ingredient
    // @param {Boolean} status. The checkbox's status associated to the ingredient
    const onChangeIngredients = (ingredients) => {
        setPizzaIngredients(ingredients);
    };

    useEffect(() => {
        console.group("Pizza states (OrderForm)");
        console.log("pizza ingredients");
        console.table(pizzaIngredients);
        console.log("pizza quantity:", pizzaQuantity);
        console.log("pizza size:", pizzaSize);
        console.groupEnd();
    });

    // handler for PizzaSize component
    // @param {String} ingredient
    // @param {Boolean} status. The checkbox's status associated to the ingredient
    const onChangeSize = (size) => {
        setPizzaSize(size);
    };

    // handler for onSubmit event associated to the button "Aggiungi".
    // If the order passes the check of the validator, it will be submitted to the parent container
    const onSubmitButton = () => {
        const order = {
            size: pizzaSize,
            quantity: pizzaQuantity,
            requests: pizzaRequests,
            ingredients: pizzaIngredients,
        };
        const { error } = utils.validateOrder(order);
        console.log(error);
        if (!error) handleOrderSubmit(order);
    };

    return (
        <div id={currComponentId} className="container-small">
            <PizzaSize sizes={sizes} handlerOnChange={onChangeSize} />
            <PizzaIngredientsMenu ingredients={ingredients} size={pizzaSize} handleOnChange={onChangeIngredients} />
            <PizzaRequests {...{ setPizzaRequests }} />
            <PizzaQuantity size={pizzaSize} handlerOnChange={setPizzaQuantity} />
            <button id={buttonSubmitId} onClick={onSubmitButton} className="btn btn-submit">
                Aggiungi
            </button>
        </div>
    );
};

export { OrderForm };
