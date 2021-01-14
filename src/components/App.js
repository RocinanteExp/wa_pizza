import "../styles/App.css";
import { useState, useEffect, StrictMode } from "react";
import { OrderForm } from "./OrderForm";
import { OrderPreview } from "./OrderPreview";
import constants from "../utils/constants";
import utils from "../utils/utils";

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
    sizes: Object.values(constants.PIZZA_SIZES),
    ingredients: Object.values(constants.PIZZA_INGREDIENTS),
    requests: undefined,
    quantity: 1,
};

/**
 * All the current orders shown on the OrderPreview are stored in the state "orders".
 * Each time an order is been submitted from the OrderForm, the state "orders" is updated
 **/
const MainContent = () => {
    const [orders, setOrders] = useState([]);

    const handleOrderSubmit = (order) => {
        console.group("Submitting order (MainContent)");
        console.log(order);
        console.groupEnd();

        setOrders([...orders, order]);
    };

    const handleOrderRemove = (indexOrder) => {
        const newOrders = utils.removeItemFromArray(orders, indexOrder);
        setOrders(newOrders);
    };

    useEffect(() => {
        console.group("Current orders (MainContent)");
        console.log(orders);
        console.groupEnd();
    });

    return (
        <main className="container-flex flex-main-center main-content">
            <OrderForm templateForm={templateForm} handleOrderSubmit={handleOrderSubmit} />
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
