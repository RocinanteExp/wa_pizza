import { useState, useEffect, useContext } from "react";
import { OrderForm } from "./OrderForm";
import { OrderPreview } from "./OrderPreview";
import { ContainerFlex } from "./Container";
import { Dialog } from "./Dialog";
import { UserContext } from "./App";
import { Error, errno } from "../utils/error";
import sys from "../utils/constants";
import utils from "../utils/utils";
import OrderItem from "../entities/OrderItem";
import print from "../utils/printer";
import customerApi from "../api/customerApi";
import generalApi from "../api/generalApi";

const debugOrders = [
    new OrderItem(
        "medium",
        [
            { name: "Bacon", side: "both" },
            { name: "Verdure", side: "both" },
        ],
        4,
        sys.PIZZA_PRICES["MEDIUM"]
    ),
    new OrderItem(
        "large",
        [
            { name: "Bacon", side: "left" },
            { name: "Verdure", side: "right" },
            { name: "Frutti di mare", side: "both" },
        ],
        4,
        sys.PIZZA_PRICES["LARGE"]
    ),
];

/**
 * All the current order's items shown on the OrderPreview are stored in the state "orderItems".
 * Each time an item is been submitted from the OrderForm, the state "orderItems" is updated
 * maxQuantityPerPizza represents the maximum number of pizza per type that a customer can order
 * PIZZA_MAX_QUANTITIES = { small: 0, medium: 8, large: 10 };
 **/
const OrderBuilder = () => {
    const user = useContext(UserContext);
    const [orderItems, setOrderItems] = useState([]);
    const [maxQuantityPerPizza, setMaxQuantityPerPizza] = useState({ small: 0, medium: 0, large: 0 });
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);
    const [doReset, setDoReset] = useState(false);

    // called by OrderForm
    const handleFormSubmit = (item) => {
        print.grp("Received order item from OrderFrom (OrderBuilder)");
        print.out(item);
        print.grpend();

        // add the new item
        setOrderItems([...orderItems, item]);

        // update the number of available pizzas
        // i.e. subtract the quantity requested from the available quantities
        setMaxQuantityPerPizza((maxQuantityPerPizza) => ({
            ...maxQuantityPerPizza,
            [item.size]: maxQuantityPerPizza[item.size] - item.quantity,
        }));
    };

    function genMessage(type, msg) {
        setTypeMessage(type);
        setMessage(msg);
    }

    // Submitting the order to the server
    const handleOrderSubmit = async () => {
        if (isWaiting) return;

        setIsWaiting(true);
        try {
            const copy = [...orderItems];

            const totItems = copy.reduce((total, item) => total + item.quantity, 0);
            if (totItems >= 3) copy.forEach((item) => (item.discount = 10));

            console.log("SENDING", totItems, orderItems);
            const status = await customerApi.sendOrder(user.id, copy);
            switch (status) {
                case 204: {
                    genMessage("info", "Ordine inviato correttamente");
                    setDoReset(true);
                    break;
                }
                case 409: {
                    const availabilities = await generalApi.getPizzaAvailabilities();

                    const copy = { ...availabilities };
                    for (const item of orderItems) {
                        availabilities[item.size] -= item.quantity;
                    }

                    const message = [];
                    for (const [size, value] of Object.entries(availabilities)) {
                        if (value < 0) {
                            message.push(
                                `${copy[size] === 1 ? "1 pizza" : copy[size] + " pizze"} ${utils.capitalize(size)}`
                            );
                        }
                    }

                    genMessage("info", "Sono rimaste " + message.join(", "));
                    break;
                }
                default: {
                }
            }
        } catch (err) {
            genMessage("error", Error.getMessage(errno.SERVER_FAILED_CONNECTION));
        } finally {
            setIsWaiting(false);
        }
    };

    // called by the orderPreview
    // called when "Rimuovi" has been selected
    const handleOrderItemRemove = (indexItem) => {
        const item = orderItems[indexItem];

        const newOrders = utils.removeItemFromArray(orderItems, indexItem);

        setMaxQuantityPerPizza((maxQuantityPerPizza) => ({
            ...maxQuantityPerPizza,
            [item.size]: maxQuantityPerPizza[item.size] + item.quantity,
        }));
        setOrderItems(newOrders);
    };

    // called by the orderPreview
    // called when a user changes the quantity of an item
    const handleChangeOrderItemQuantity = (indexItem, quantity) => {
        const item = orderItems[indexItem];
        item.quantity -= quantity;

        const newOrders = [...orderItems];
        newOrders[indexItem] = item;

        setMaxQuantityPerPizza((maxQuantityPerPizza) => ({
            ...maxQuantityPerPizza,
            [item.size]: maxQuantityPerPizza[item.size] + quantity,
        }));

        setOrderItems(newOrders);
    };

    // retrieve from the server the available quantities for each pizza's size
    // called the first time the component is mounted
    useEffect(() => {
        let isMounted = true;

        async function retrieveState() {
            try {
                const availabilities = await generalApi.getPizzaAvailabilities();
                if (isMounted) setMaxQuantityPerPizza(availabilities);
            } catch (err) {
                genMessage("error", Error.getMessage(errno.SERVER_FAILED_CONNECTION));
            }
        }

        retrieveState();

        return () => (isMounted = false);
    }, []);

    // reset the states of the component
    useEffect(() => {
        let isMounted = true;

        // reset the states of the component
        async function reset() {
            try {
                const availabilities = await generalApi.getPizzaAvailabilities();

                if (isMounted) {
                    setOrderItems([]);
                    setDoReset(false);
                    setMaxQuantityPerPizza(availabilities);
                }
            } catch (err) {
                if (isMounted) {
                    genMessage("error", Error.getMessage(errno.SERVER_FAILED_CONNECTION));
                }
            }
        }

        if (doReset) reset();

        return () => (isMounted = false);
    }, [doReset]);

    const handleMessage = (msg) => {
        if (msg.type === "error" && typeMessage !== "error") {
            setTypeMessage("error");
            setMessage(msg.message);
        } else if (msg.type === "info") {
            setTypeMessage("info");
            setMessage(msg.message);
        }
    };

    function resetMessage() {
        setTypeMessage("");
        setMessage("");
    }

    return (
        <main>
            {message ? <Dialog type={typeMessage} message={message} handles={{ onClick: resetMessage }} /> : null}
            <ContainerFlex padding={true}>
                <OrderForm
                    maxQuantityPerPizza={maxQuantityPerPizza}
                    handles={{
                        onSubmit: handleFormSubmit,
                        onMessage: handleMessage,
                    }}
                />
                <OrderPreview
                    items={orderItems}
                    handles={{
                        onChange: handleChangeOrderItemQuantity,
                        onRemove: handleOrderItemRemove,
                        onSubmit: handleOrderSubmit,
                    }}
                />
            </ContainerFlex>
        </main>
    );
};

export default OrderBuilder;
