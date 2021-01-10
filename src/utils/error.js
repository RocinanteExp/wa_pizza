const errno = {
    PIZZA_INGREDIENTS_EMPTY: 10,
    PIZZA_QUANTITY_EXCEEDED: 11,
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
                const message = `The pizza ingredients are empty`;
                return message;
            }
            case errno.PIZZA_QUANTITY_EXCEEDED: {
                console.log(args);
                const message = `Maximun quantity for this pizza is ${args[1]}`;
                return message;
            }
            default: {
                console.log(`${this.code} not implemented in Error.createMessage`);
                break;
            }
        }
    }
}

export {factoryError, Error, errno}
