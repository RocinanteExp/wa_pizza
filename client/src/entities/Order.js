import sys from "../utils/constants";

class Order {
    constructor(size, ingredients, quantity, price, requests, id) {
        this.size = size;
        this.ingredients = ingredients;
        this.quantity = quantity;
        this.requests = requests;
        this.price = price || 0;

        this.discount = this.computeDiscount();
        this.extra = this.computeExtra();

        this.id = id;
    }

    getSubTotal() {
        return this.price * this.quantity;
    }

    get subtotal() {
        return this.price * this.quantity;
    }

    getSubTotalWithExtras() {
        return this.getSubTotal() + this.extra;
    }

    get subTotalWithExtras() {
        return this.getSubTotal() + this.extra;
    }

    getTotal() {
        return (this.getSubTotalWithExtras() * (100 - this.discount)) / 100;
    }

    get total() {
        return (this.getSubTotalWithExtras() * (100 - this.discount)) / 100;
    }

    computeExtra() {
        if (this.size === sys.PIZZA_SIZES.LARGE) {
            const doAdd = this.ingredients.some((i) => i.name.toLowerCase() === "frutti di mare");
            if (doAdd) return this.getSubTotal() * 0.2;
        }

        return 0;
    }

    computeDiscount() {
        if (this.quantity > 3) {
            return 10;
        }

        return 0;
    }

    toString() {
        return (
            `${this.quantity} x pizza ${this.size} ingredients ${this.ingredients.join(" ")} price => ${this.price}` +
            ` subTotal => ${this.getSubTotal()} total => ${this.getTotal()}`
        );
    }
}

export default Order;
