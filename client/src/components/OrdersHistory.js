import { useState, useEffect, useContext } from "react";
import { UserContext } from "./App";
import { Dialog } from "./Dialog";

import { ContainerFlex } from "./Container";
import { TableOrder } from "./Table";
import { Error, errno } from "../utils/error";
import api from "../api/customerApi";
import sys from "../utils/constants";
import OrderItem from "../entities/OrderItem";

const AccordionOrder = ({ order }) => {
    const key = `key-accordion-order-${order[0].orderId}`;

    const rows = order.map((item) => parseJsonOrder(item));

    const totPizze = rows.reduce((acc, orderItem) => acc + orderItem.quantity, 0);
    const totCost = rows.reduce((acc, orderItem) => acc + orderItem.total, 0);

    const leftSummary = `+ Ordine n. ${order[0].orderId} (${totPizze} x ${totPizze === 1 ? "pizza" : "pizze"})`;
    const rightSummary = `totale: ${totCost.toFixed(2)}€`;

    return (
        <ContainerFlex mainAxis="spaceBetween" style={{ maxWidth: "max(50%, 804px)" }}>
            <details key={key}>
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
    const summaries = orders.map((order, index) => <AccordionOrder order={order} key={`key-order-${index}`} />);
    return summaries;
}

const OrdersHistory = () => {
    const user = useContext(UserContext);
    const [pastOrders, setPastOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");

    useEffect(() => {
        if (!user) {
            setTypeMessage("info");
            setMessage(Error.getMessage(errno.USER_LOGIN_REQUIRED));
            return;
        }

        let isMounted = true;

        async function fetchOrders() {
            try {
                const orders = await api.getCustomerOrdersHistory(user.id);

                if (isMounted) {
                    if (orders.length === 0) {
                        setTypeMessage("info");
                        setMessage("Non hai effettuato alcun ordine");
                    }
                    setPastOrders(orders);
                }
            } catch (err) {
                setTypeMessage("error");
                setMessage(Error.getMessage(errno.SERVER_FAILED_CONNECTION));
            }
        }

        fetchOrders();

        return () => (isMounted = false);
    }, []);

    return (
        <>
            {message ? (
                <Dialog type={typeMessage} message={message} handles={{ onClick: () => setMessage("") }} />
            ) : (
                <ContainerFlex dir="column">{generateSummaries(pastOrders)}</ContainerFlex>
            )}
        </>
    );
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
        jsonOrder.discount,
        jsonOrder.itemId,
        jsonOrder.orderId
    );
}

export { OrdersHistory };
