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

            Promise.resolve(orders);
            return;
        }
        Promise.reject(response.status);
    } catch (err) {
        Promise.reject("Generic Error");
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

    return response.status;
}

const api = { getCustomerOrdersHistory, sendOrder };
export default api;
