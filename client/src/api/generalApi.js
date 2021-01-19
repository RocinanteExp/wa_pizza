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
        console.log(user);
        return Promise.resolve(user);
    }

    return Promise.reject();
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

const api = { userLogin, userLogout };
export default api;
