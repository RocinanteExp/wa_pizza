import "../styles/App.css";
import { useState, useEffect, useContext } from "react";
import { PizzaIngredientsMenu } from "./IngredientsMenu";
import { Error, errno } from "../utils/error";
import { Counter } from "./Counter";
import { Container, ContainerFlex } from "./Container";
import { Button } from "./Button";
import { UserContext } from "./App";
import sys from "../utils/constants";
import OrderItem from "../entities/OrderItem";
import utils from "../utils/utils";
import print from "../utils/printer";

const PizzaSize = ({ sizesName, maxPerPizza, handles }) => {
    const [activeButton, setActiveButton] = useState("");

    const currComponentId = "id-container-pizza-size";
    const currComponentTitle = "Dimensione Pizza";
    const buttonsName = [...sizesName];

    useEffect(() => {
        handles.onChange(activeButton);
        if (maxPerPizza && activeButton && maxPerPizza[activeButton] === 0) setActiveButton("");
    }, [maxPerPizza, setActiveButton, activeButton, handles]);

    const handleOnClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <Container id={currComponentId} title={currComponentTitle}>
            <ContainerFlex>
                {buttonsName.map((name) => {
                    let isDisabled = false;
                    if (maxPerPizza[name] <= 0) isDisabled = true;
                    const active = name === activeButton ? "active" : "inactive";
                    const text = `${name.toUpperCase()} ${maxPerPizza[name]}`;

                    return (
                        <Button
                            color="dark"
                            key={`key-${name}`}
                            status={{ active }}
                            handles={{ onClick: () => handleOnClick(name) }}
                            disabled={isDisabled}
                        >
                            {text}
                        </Button>
                    );
                })}
            </ContainerFlex>
        </Container>
    );
};

const PizzaRequests = ({ checked, handles }) => {
    const currComponentId = "id-container-pizza-requests";
    const currComponentTitle = "Richieste";

    const handleChange = (event) => {
        if (event.target.checked) handles.onChange(event.target.value);
        else handles.onChange(undefined);
    };

    return (
        <Container id={currComponentId} title={currComponentTitle} margin={"bottom"}>
            <ContainerFlex crossAxis="center">
                <input
                    checked={checked}
                    id="input-id-senza-pomodoro"
                    value="senza-pomodoro"
                    type="checkbox"
                    onChange={handleChange}
                />
                <label
                    className="container-flex flex-ca-center"
                    htmlFor="input-id-senza-pomodoro"
                    style={{ width: "100%" }}
                >
                    Senza pomodoro
                </label>
            </ContainerFlex>
        </Container>
    );
};

const PizzaQuantity = ({ handles, max = 0 }) => {
    const currComponentId = "id-container-pizza-quantity";
    const currComponentTitle = "Quantità";

    const handleChangeCurrQuantity = (quantity) => {
        handles.onChange(quantity);
    };

    return (
        <Container id={currComponentId} title={currComponentTitle} margin="bottom">
            <Counter min={Math.min(1, max)} max={max} callback={(quantity) => handleChangeCurrQuantity(quantity)} />
        </Container>
    );
};

// the ingredient's name must be unique
const OrderForm = ({ maxQuantityPerPizza, handles }) => {
    const user = useContext(UserContext);
    const currComponentId = "id-order-form";
    const buttonSubmitId = "id-btn-form-submit";

    const [pizzaSize, setPizzaSize] = useState("");
    const [pizzaIngredients, setPizzaIngredients] = useState([]);
    const [pizzaRequests, setPizzaRequests] = useState(undefined);
    const [pizzaQuantity, setPizzaQuantity] = useState(0);

    let ingredientsName = [...Object.values(sys.PIZZA_INGREDIENTS)];
    if (pizzaSize !== sys.PIZZA_SIZES.LARGE) ingredientsName = ingredientsName.filter((i) => i !== "frutti di mare");

    const sizesName = [...Object.values(sys.PIZZA_SIZES)];

    function resetStates() {
        setPizzaSize("");
        setPizzaIngredients([]);
        setPizzaRequests(undefined);
        setPizzaQuantity(0);
    }

    // handles
    const handleChangePizzaQuantity = (newQuantity) => {
        setPizzaQuantity(newQuantity);
    };

    const handleChangePizzaIngredients = (ingredient) => {
        setPizzaIngredients(ingredient);
    };

    const handleChangePizzaSize = (size) => {
        setPizzaSize(size);
    };

    const handleChangePizzaRequests = (requests) => {
        setPizzaRequests(requests);
    };

    // handler for onSubmit event associated to the button "Aggiungi".
    // If the order passes the check of the validator, it will be submitted to the parent container
    const handleSubmitButton = () => {
        if (!user) {
            handles.onMessage({
                type: "info",
                message: Error.getMessage(errno.USER_LOGIN_REQUIRED),
            });

            return;
        }

        const order = new OrderItem(
            pizzaSize,
            pizzaIngredients,
            pizzaQuantity,
            sys.PIZZA_PRICES[pizzaSize.toUpperCase()],
            pizzaRequests
        );

        const { error } = utils.validateOrder(order);

        if (error) {
            handles.onMessage({
                type: "info",
                message: error.message,
            });

            return;
        }

        resetStates();
        handles.onSubmit(order);
    };

    const generateButtonText = () => {
        if (!user || !pizzaSize) return "Niente da aggiungere";

        let totPrices = sys.PIZZA_PRICES[pizzaSize.toUpperCase()] * pizzaQuantity;
        const text = `Aggiungi ${pizzaQuantity} articoli all'ordine `;

        if (pizzaSize === sys.PIZZA_SIZES.LARGE) {
            const hasFruttiDiMare = pizzaIngredients.some((i) => i.name.toLowerCase() === "frutti di mare");
            if (hasFruttiDiMare) totPrices = totPrices * 1.2;
        }

        return (
            <span>
                {text}
                {pizzaQuantity >= 3 ? (
                    <>
                        <del>{`${totPrices.toFixed(2)}€`} </del>
                        <ins> {Number(totPrices * 0.9).toFixed(2)}€</ins>
                    </>
                ) : (
                    " " + totPrices + "€"
                )}
            </span>
        );
    };

    useEffect(() => {
        // print states of the component
        print.grp("Pizza states (OrderForm)");
        print.out("pizza ingredients");
        print.tb(pizzaIngredients);
        print.out("pizza quantity:", pizzaQuantity);
        print.out("pizza size:", pizzaSize);
        print.out("pizza requests:", pizzaRequests);
        print.grpend();

        if (pizzaSize && maxQuantityPerPizza[pizzaSize] === 0) {
            setPizzaSize("");
        }
    }, [pizzaSize, maxQuantityPerPizza, pizzaIngredients, pizzaQuantity, pizzaRequests]);

    return (
        <Container id={currComponentId} className="container-form">
            <PizzaSize
                handles={{ onChange: handleChangePizzaSize }}
                sizesName={sizesName}
                maxPerPizza={maxQuantityPerPizza}
            />
            <PizzaIngredientsMenu
                handles={{ onChange: handleChangePizzaIngredients, onMessage: handles.onMessage }}
                names={ingredientsName}
                size={pizzaSize}
                maxPerSize={sys.PIZZA_MAX_INGREDIENTS[pizzaSize]}
            />
            <PizzaRequests checked={pizzaRequests ? true : false} handles={{ onChange: handleChangePizzaRequests }} />
            <PizzaQuantity
                handles={{ onChange: handleChangePizzaQuantity }}
                max={maxQuantityPerPizza[pizzaSize]}
                size={pizzaSize}
            />
            <Button id={buttonSubmitId} color="dark" handles={{ onClick: handleSubmitButton }}>
                {generateButtonText()}
            </Button>
        </Container>
    );
};

export { OrderForm };
