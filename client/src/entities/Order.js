import sys from "../utils/constants";

class Order {
    constructor(size, ingredients, quantity, price, requests, id) {
        this.size = size;
        this.ingredients = ingredients;
        this.quantity = quantity;
        this.requests = requests;
        this.price = price || 0;

        this.extra = this.computeExtra();
        this.discount = this.computeDiscount();

        this.id = id;
    }

    getSubTotal() {
        return this.price * this.quantity;
    }

    getSubTotalWithExtras() {
        return this.price * this.quantity * (1 + this.extra/100);
    }

    getTotal() {
        return this.price * this.quantity * (1 - this.discount + this.extra);
    }

    computeExtra() {
        if (this.size === sys.PIZZA_SIZES.LARGE) {
            const doAdd = this.ingredients.some((i) => i.name.toLowerCase() === "frutti di mare");
            if (doAdd) return 20;
        }
        return 0;
    }

    computeDiscount() {
        if (this.quantity > 3) {
            return 10;
        }

        return 0;
    }
}

export default Order;
