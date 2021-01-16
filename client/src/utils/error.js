const errno = {
    PIZZA_INGREDIENTS_EMPTY: 10,
    PIZZA_QUANTITY_EXCEEDED: 11,
    PIZZA_QUANTITY_MINIMUM: 12,
};

const warnings = {
    PIZZA_QUANTITY_LIMIT: 20,
}

const factoryError = (code, args = null) => {
    return new Error(code, undefined, args);
};


class Warning {
    constructor(code, message, args) {
        this.code = code;
        this.message = this.createMessage(message, args);
    }

    createMessage(message = null, args = null) {
        if (message) return message;

        switch (this.code) {
            case warnings.PIZZA_QUANTITY_LIMIT: {
                const message = `Puoi aggiungere ancora degli ingredienti`;
                return message;
            }
            default: {
                console.log(`${this.code} not implemented in Error.createMessage`);
                break;
            }
        }
    }
}

class Error {
    constructor(code, message, args) {
        this.code = code;
        this.message = this.createMessage(message, args);
    }

    createMessage(message = null, args = null) {
        if (message) return message;

        switch (this.code) {
            case errno.PIZZA_INGREDIENTS_EMPTY: {
                const message = `Prima devi selezionare gli ingredienti`;
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
}

export {factoryError, Error, Warning, errno}
