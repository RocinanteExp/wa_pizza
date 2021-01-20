import sys from "../utils/constants";

class OrderItem {
    constructor(size, ingredients, quantity, price, requests, discount, id) {
        this.size = size;
        this.ingredients = ingredients;
        this.quantity = quantity;
        this.requests = requests;
        this.price = price || 0;

        this.discount = discount || 0;
        this.extra = this.computeExtra();

        this.id = id;
    }

    get subtotal() {
        return this.price * this.quantity;
    }

    get subtotalWithExtra() {
        return this.subtotal + this.extra;
    }

    get total() {
        return (this.subtotalWithExtra * (100 - this.discount)) / 100;
    }

    computeExtra() {
        if (this.size === sys.PIZZA_SIZES.LARGE) {
            const doAdd = this.ingredients.some((i) => i.name.toLowerCase() === "frutti di mare");
            if (doAdd) return this.subtotal * 0.2;
        }

        return 0;
    }

    toString() {
        return (
            `${this.quantity} x pizza ${this.size} ingredients ${this.ingredients.join(" ")} price => ${this.price}` +
            ` subTotal => ${this.subtotal} total => ${this.total}`
        );
    }
}

export default OrderItem;
