const BASE_URL = "api/v1";

async function getCustomerOrdersHistory(customerId) {
    try {
        const response = await fetch(`${BASE_URL}/customers/${customerId}/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const orders = await response.json();
            console.log("sono api getCustomerOrdersHistory", orders);
            return orders;
        } else {
            throw response.status;
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function sendOrder(customerId, order) {
    const response = await fetch(`${BASE_URL}/customers/${customerId}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });

    if (response.ok) {
        return response.status;
    } else {
        throw response.status;
    }
}

const api = { getCustomerOrdersHistory, sendOrder };
export default api;
