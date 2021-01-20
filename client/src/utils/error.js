const errno = {
    PIZZA_INGREDIENTS_EMPTY: 10,
    PIZZA_QUANTITY_EXCEEDED: 11,
    PIZZA_QUANTITY_MINIMUM: 12,
    PIZZA_SIZE_EMPTY: 13,
    SERVER_FAILED_CONNECTION: 20,
    USER_LOGIN_REQUIRED: 21,
};

const factoryError = (code, args = null) => {
    return new Error(code, undefined, args);
};

class Error {
    constructor(code, message, args) {
        this.code = code;
        this.message = this.createMessage(message, args);
    }

    createMessage(message = null, args = null) {
        if (message) return message;

        switch (this.code) {
            case errno.PIZZA_INGREDIENTS_EMPTY: {
                const message = `Seleziona gli ingredienti`;
                return message;
            }
            case errno.PIZZA_SIZE_EMPTY: {
                const message = `Seleziona la dimensione della pizza`;
                return message;
            }
            case errno.PIZZA_QUANTITY_EXCEEDED: {
                const message = `Puoi ordinare al massimo ${args.maxQuantity} pizze ${args.size}`;
                return message;
            }
            case errno.PIZZA_QUANTITY_MINIMUM: {
                const message = `La quantità deve essere al minimo ${args.minQuantity}`;
                return message;
            }
            default: {
                console.log(`${this.code} not implemented in Error.createMessage`);
                break;
            }
        }
    }

    static getMessage(code) {
        switch (code) {
            case errno.SERVER_FAILED_CONNECTION: {
                const message = "Fallita la connessione con il server. Ricarica la pagina";
                return message;
            }
            case errno.USER_LOGIN_REQUIRED: {
                const message = "Devi effettuare il login per accedere a questa risorsa";
                return message;
            }
            default: {
                console.log(`errno: ${errno} not implemented in Error.getErrorMessage`);
                return "";
            }
        }
    }
}

export { factoryError, Error, errno };
