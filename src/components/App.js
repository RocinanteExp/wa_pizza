import "../styles/App.css";
import { useState, useEffect, StrictMode } from "react";
import { OrderForm } from "./OrderForm";
import { OrderPreview } from "./OrderPreview";
import sys from "../utils/constants";
import utils from "../utils/utils";
import print from "../utils/printer";

//const MAX_NUM_PIZZA = { Small: 10, Medium: 5, Large: 10 };

const MainNavbar = () => {
    return (
        <nav className="main-nav">
            <ul>
                <li>Login</li>
                <li>Ordina</li>
                <li>I miei ordini</li>
            </ul>
        </nav>
    );
};

const Header = () => {
    return (
        <div className="main-header">
            <div className="logo"></div>
            <MainNavbar />
        </div>
    );
};

const templateForm = {
    sizes: Object.values(sys.PIZZA_SIZES),
    ingredientsName: Object.values(sys.PIZZA_INGREDIENTS),
    requests: undefined,
    quantity: 1,
};

/**
 * All the current orders shown on the OrderPreview are stored in the state "orders".
 * Each time an order is been submitted from the OrderForm, the state "orders" is updated
 **/
const MainContent = () => {
    const [orders, setOrders] = useState([]);
    const [maxQuantityPerPizza, setMaxQuantityPerPizza] = useState({ ...sys.PIZZA_MAX_QUANTITIES });

    const opcode = {
        MINUS: 0,
        PLUS: 1,
    };

    const opOnMaxQuantityPerPizza = (side, op, quantity) => {
        switch (op) {
            case opcode.MINUS: {
                return { [side]: maxQuantityPerPizza[side] - quantity };
            }
            case opcode.PLUS: {
                return { [side]: maxQuantityPerPizza[side] + quantity };
            }
            default:
                break;
        }
    };

    const handleSubmitOrders = (order) => {
        print.grp("Submitting order (MainContent)");
        print.out(order);
        print.grpend();

        setOrders([...orders, order]);
        handleChangeMaxQuantityPerPizza(opOnMaxQuantityPerPizza(order.size, opcode.MINUS, order.quantity));
    };

    const handleChangeMaxQuantityPerPizza = (value) => {
        console.log("IPDAE", value);
        setMaxQuantityPerPizza((maxQuantityPerPizza) => ({ ...maxQuantityPerPizza, ...value }));
    };

    const handleOrderRemove = (indexOrder) => {
        const newOrders = utils.removeItemFromArray(orders, indexOrder);
        setOrders(newOrders);
    };

    useEffect(() => {
        print.grp("Current orders (MainContent)");
        print.tb(orders);
        print.out(maxQuantityPerPizza);
        print.grpend();
    });

    return (
        <main className="container-flex flex-main-center main-content">
            <OrderForm
                sizes={templateForm.sizes}
                maxQuantityPerPizza={maxQuantityPerPizza}
                handles={{ onSubmit: handleSubmitOrders }}
            />
            <OrderPreview orders={orders} handleOrderRemove={handleOrderRemove} />
        </main>
    );
};

const App = () => {
    return (
        <StrictMode>
            <div className="container">
                <Header />
                <MainContent />
            </div>
        </StrictMode>
    );
};

export default App;
