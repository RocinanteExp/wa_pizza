import "../styles/App.css";
import { useState, useEffect } from "react";
import { PizzaIngredientsMenu } from "./IngredientsMenu";
import { Counter } from "./Counter";
import { CenterDialog } from "./Dialog";
import { Container, ContainerFlex } from "./Container";
import { Button } from "./Button";
import sys from "../utils/constants";
import Order from "../entities/Order";
import utils from "../utils/utils";
import checker from "../utils/checker";
import print from "../utils/printer";

const PizzaSize = ({ sizesName, maxPerPizza, handles }) => {
    const [activeButton, setActiveButton] = useState("");

    const currComponentId = "id-container-pizza-size";
    const currComponentTitle = "Dimensione Pizza";
    const buttonsName = [...sizesName];

    useEffect(() => {
        //console.group("states of PizzaSize");
        //console.log("active button => ", activeButton);
        //console.groupEnd();
        handles.onChange(activeButton);
        if (maxPerPizza && activeButton && maxPerPizza[activeButton] === 0) setActiveButton("");
    }, [maxPerPizza, setActiveButton, activeButton, handles]);

    const handleOnClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <Container id={currComponentId} title={currComponentTitle} className="pizza-size-container margin-bottom">
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
                            status={{ active, disabled: isDisabled }}
                            handles={{ onClick: () => handleOnClick(name) }}
                        >
                            {text}
                        </Button>
                    );
                })}
            </ContainerFlex>
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

const PizzaQuantity = ({ handles, size, max = 0 }) => {
    const [currQuantity, setCurrQuantity] = useState(max);

    const currComponentId = "id-container-pizza-quantity";
    const currComponentTitle = "Quantità";
    const buttonSubmitId = "id-btn-aggiungi";

    const styles = { marginBottom: "1.5rem" };

    const generateText = () => {
        if (!size) return "Niente";

        const totPrices = sys.PIZZA_PRICES[size.toUpperCase()] * currQuantity;
        const text = `Aggiungi ${currQuantity} articoli all'ordine ${totPrices} €`;

        return text;
    };

    const handleChangeCurrQuantity = (quantity) => {
        setCurrQuantity(quantity);
        handles.onChange(quantity);
    };

    useEffect(() => {
        print.grp("PizzaQuantity");
        print.out(currQuantity);
        print.grpend();
    });

    return (
        <Container id={currComponentId} style={styles} title={currComponentTitle}>
            <Counter min={Math.min(1, max)} max={max} callback={(quantity) => handleChangeCurrQuantity(quantity)} />
            <Button id={buttonSubmitId} color="dark" handles={{ onClick: handles.onSubmit }}>
                {generateText()}
            </Button>
        </Container>
    );
};

// the ingredient's name must be unique
const OrderForm = ({ sizes, maxQuantityPerPizza, handles }) => {
    const currComponentId = "id-order-form";

    const [pizzaSize, setPizzaSize] = useState("");
    const [pizzaIngredients, setPizzaIngredients] = useState([]);
    const [pizzaRequests, setPizzaRequests] = useState(undefined);
    const [pizzaQuantity, setPizzaQuantity] = useState(-1);
    const [message, setMessage] = useState({});

    const handleChangeQuantity = (newQuantity) => {
        setPizzaQuantity(newQuantity);
    };

    // handler for PizzaIngredients component
    // @param {String} ingredient
    // @param {Boolean} status. The checkbox's status associated to the ingredient
    const handleChangePizzaIngredients = (ingredient) => {
        setPizzaIngredients(ingredient);
    };

    useEffect(() => {
        // print states of the component
        print.grp("Pizza states (OrderForm)");
        print.out("pizza ingredients");
        print.tb(pizzaIngredients);
        print.out("pizza quantity:", pizzaQuantity);
        print.out("pizza size:", pizzaSize);
        print.grpend();

        // remove the message dialog from the screen after 1,75s
        if (!checker.isObjEmpty(message)) {
            (() => setTimeout(() => setMessage({}), 1750))();
        }

        if (pizzaSize && maxQuantityPerPizza[pizzaSize] === 0) {
            setPizzaSize("");
        }
    }, [pizzaSize, maxQuantityPerPizza, message, pizzaIngredients, pizzaQuantity]);

    // handler for PizzaSize component
    // @param {String} ingredient
    // @param {Boolean} status. The checkbox's status associated to the ingredient
    const handleChangePizzaSize = (size) => {
        setPizzaSize(size);
    };

    // handler for onSubmit event associated to the button "Aggiungi".
    // If the order passes the check of the validator, it will be submitted to the parent container
    const handleSubmitButton = () => {
        const order = new Order(
            pizzaSize,
            pizzaIngredients,
            pizzaQuantity,
            sys.PIZZA_PRICES[pizzaSize.toUpperCase()],
            pizzaQuantity
        );

        const { error } = utils.validateOrder(order);

        if (error) {
            setMessage({
                type: "error",
                message: error.message,
            });

            print.out(error);
            return;
        }

        print.grp("Submitting order (OrderForm)");
        print.out(order);
        print.grpend();

        handles.onSubmit(order);
    };

    return (
        <div id={currComponentId} className="container-small">
            <PizzaSize
                sizesName={sizes}
                maxPerPizza={maxQuantityPerPizza}
                handles={{ onChange: handleChangePizzaSize }}
            />
            <PizzaIngredientsMenu size={pizzaSize} handleOnChange={handleChangePizzaIngredients} />
            <PizzaRequests {...{ setPizzaRequests }} />
            <PizzaQuantity
                size={pizzaSize}
                max={maxQuantityPerPizza[pizzaSize]}
                handles={{ onChange: handleChangeQuantity, onSubmit: handleSubmitButton }}
            />
            <CenterDialog {...message} />
        </div>
    );
};

export { OrderForm };
