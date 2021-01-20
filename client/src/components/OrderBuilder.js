import { useState, useEffect } from "react";
import { OrderForm } from "./OrderForm";
import { OrderPreview } from "./OrderPreview";
import { ContainerFlex } from "./Container";
import { Dialog } from "./Dialog";
import sys from "../utils/constants";
import utils from "../utils/utils";
import OrderItem from "../entities/OrderItem";
import print from "../utils/printer";
import customerApi from "../api/customerApi";
import generalApi from "../api/generalApi";

//const templateForm = {
//    sizes: Object.values(sys.PIZZA_SIZES),
//    ingredientsName: Object.values(sys.PIZZA_INGREDIENTS),
//    requests: undefined,
//    quantity: 1,
//};
//

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
    const [orderItems, setOrderItems] = useState([]);
    const [maxQuantityPerPizza, setMaxQuantityPerPizza] = useState({ small: 0, medium: 0, large: 0 });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

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

    // reset the states of the component
    const reset = async () => {
        try {
            const availabilities = await generalApi.getPizzaAvailabilities();
            setMaxQuantityPerPizza(availabilities);
            setOrderItems([]);
        } catch (err) {
            setError("Fallita la connessione con il server. Ricarica la pagina");
        }
    };

    // Submitting the order to the server
    const handleOrderSubmit = async () => {
        if (isWaiting) return;

        setIsWaiting(true);
        try {
            const status = await customerApi.sendOrder(1, orderItems);
            switch (status) {
                case 204: {
                    setMessage("Ordine inviato correttamente");
                    reset();
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

                    setMessage("Sono rimaste " + message.join(", "));
                    break;
                }
                default: {
                }
            }
        } catch (err) {
            setError("Fallita la connessione con il server. Ricarica la pagina");
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
    // called when a user changed the quantity of an item
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

    // retrieve from the server the available quantity for each size of pizza
    // called the first time the component has been mounted
    useEffect(() => {
        async function retrieveState() {
            try {
                const availabilities = await generalApi.getPizzaAvailabilities();
                setMaxQuantityPerPizza(availabilities);
            } catch (err) {
                setError("Fallita la connessione con il server. Ricarica la pagina");
            }
        }

        retrieveState();
    }, []);

    useEffect(() => {
        print.grp("Current orderItems (OrderBuilder)");
        print.tb(orderItems);
        print.out(maxQuantityPerPizza);
        print.grpend();

        //if (message) setTimeout(() => setMessage(""), 1500);
    }, [orderItems, maxQuantityPerPizza]);

    const handleMessage = (msg) => {
        if (msg.type === "error" && error === "") setError(msg.message);
        else if (msg.type === "info") setMessage(msg.message);
    };

    return (
        <main>
            {message ? <Dialog type="info" message={message} handles={{ onClick: () => setMessage("") }} /> : null}
            {error ? <Dialog type="error" message={error} handles={{ onClick: () => setError("") }} /> : null}
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
