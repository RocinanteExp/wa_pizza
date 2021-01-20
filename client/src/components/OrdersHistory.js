import { useState, useEffect } from "react";

import { ContainerFlex } from "./Container";
import { TableOrder } from "./Table";
import api from "../api/customerApi";
import sys from "../utils/constants";
import OrderItem from "../entities/OrderItem";

const AccordionOrder = (order) => {
    const key = `key-accordion-order-${order[0].orderId}`;

    const rows = order.map((item) => parseJsonOrder(item));

    const totPizze = rows.reduce((acc, orderItem) => acc + orderItem.quantity, 0);
    const totCost = rows.reduce((acc, orderItem) => acc + orderItem.total, 0);

    const leftSummary = `+ Ordine n. ${order[0].orderId} (${totPizze} x ${totPizze === 1 ? "pizza" : "pizze"})`;
    const rightSummary = `totale: ${totCost.toFixed(2)}€`;

    const handleOnToggle = (event) => {
        console.log(event.target.open);
    };

    return (
        <ContainerFlex mainAxis="spaceBetween" style={{ maxWidth: "max(50%, 804px)" }}>
            <details key={key} onToggle={handleOnToggle}>
                <summary>
                    <span>{leftSummary}</span>
                    <span>{rightSummary}</span>
                </summary>
                <TableOrder mapping={sys.TABLE_ROW_ORDER_ITEM_MAPPINGS} header={sys.TABLE_ORDER_HEADER} rows={rows} />
            </details>
        </ContainerFlex>
    );
};

function generateSummaries(o) {
    const orders = groupByOrderId(o);
    const summaries = orders.map(AccordionOrder);
    return summaries;
}

const OrdersHistory = () => {
    const user = useContext(MyContext);
    const [pastOrders, setPastOrders] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function fetchOrders() {
            try {
                const orders = await api.getCustomerOrdersHistory(userId);

                if (isMounted) setPastOrders(orders);
            } catch (err) {
                console.log("catch di useEffect => fetchOrders", err);
            }
        }

        fetchOrders();

        return () => (isMounted = false);
    }, []);

    return <ContainerFlex dir="column">{generateSummaries(pastOrders)}</ContainerFlex>;
};

/**
 * group an array of orderItem by their orderId
 * @param {Array} of Order. [item.id1, item2.id1, item3.id2]
 * @returns {Array} of array. [[item, item2], [item3]]
 **/
function groupByOrderId(o) {
    const ret = [];
    const orders = [...o];

    // sort the array
    orders.sort((a, b) => a.orderId - b.orderId);

    let last = null;
    let group = [];
    for (const order of orders) {
        // a different letter means a new group
        if (order.orderId !== last) {
            group = [];
            last = order.orderId;
            ret.push(group);
        }

        group.push(order);
    }

    return ret;
}

/**
 * map an a json orderItem to a orderItem instance
 * @param {Array} of Order. [item.id1, item2.id1, item3.id2]
 * @returns {Array} of array. [[item, item2], [item3]]
 **/
function parseJsonOrder(jsonOrder) {
    const regex = /[A-Za-z ]+,\s?[A-Za-z ]+/g;

    const found = jsonOrder.ingredients.match(regex);

    const ingredients = found.map((elem) => {
        const splits = elem.split(",");
        return { name: splits[0], side: splits[1].trim() };
    });

    return new OrderItem(
        jsonOrder.size,
        ingredients,
        jsonOrder.quantity,
        jsonOrder.price,
        jsonOrder.requests,
        jsonOrder.orderId
    );
}

export { OrdersHistory };
