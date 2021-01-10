import "../styles/App.css";
import { useState } from "react";
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
    sizes: constants.PIZZA_DEF_SIZES,
    ingredients: constants.PIZZA_DEF_INGREDIENTS,
    requests: undefined,
    quantity: 1,
};

const MainContent = () => {
    const [orders, setOrders] = useState([]);

    const handleOrderSubmit = (order) => {
        const newOrders = orders.slice();
        newOrders.push(order);
        console.log(newOrders);
        setOrders(newOrders);
    };

    const handleOrderRemove = (indexOrder) => {
        const newOrders = utils.removeItemFromArray(orders, indexOrder);
        setOrders(newOrders);
    };

    return (
        <main className="container-flex flex-main-center main-content">
            <OrderForm templateForm={templateForm} handleOrderSubmit={handleOrderSubmit} />
            <OrderPreview orders={orders} handleOrderRemove={handleOrderRemove}/>
        </main>
    );
};

const App = () => {
    return (
        <div className="container">
            <Header />
            <MainContent />
        </div>
    );
};

export default App;
