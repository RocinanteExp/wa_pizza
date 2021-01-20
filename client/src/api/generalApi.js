const BASE_URL = "api/v1";

async function userLogin(email, password) {
    const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } 

    return response.status;
}

async function userLogout(email, password) {
    const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const user = await response.json();
        console.log(user);
        return Promise.resolve(user);
    }

    return Promise.reject();
}

async function getPizzaAvailabilities() {
    try {
        const response = await fetch(BASE_URL + "/pizzas/availabilities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const ret = await response.json();
            delete ret.id;

            return ret;
        } else {
            throw new Error("Server connection error");
        }
    } catch (err) {
        throw new Error("Server connection error");
    }
}

const api = { userLogin, userLogout, getPizzaAvailabilities };
export default api;
