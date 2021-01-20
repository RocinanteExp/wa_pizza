const PIZZA_INGREDIENTS = {
    BACON: "bacon",
    CARCIOFI: "carciofi",
    FRUTTI_DI_MARE: "frutti di mare",
    FUNGHI: "funghi",
    OLIVE: "olive",
    PATATINE: "patatine",
    PROSCIUTTO: "prosciutto",
    UOVA: "uova",
    VERDURE: "verdure",
};

const PIZZA_SIZES = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
};

const PIZZA_SIDES = {
    LEFT: "left",
    RIGHT: "right",
    BOTH: "both",
};

const PIZZA_PRICES = {
    SMALL: 4,
    MEDIUM: 6,
    LARGE: 10,
};

const PIZZA_MAX_QUANTITIES = { small: 0, medium: 8, large: 10 };
const PIZZA_MAX_INGREDIENTS = { small: { both: 2 }, medium: { both: 3 }, large: { left: 3, right: 3 } };

Object.freeze(PIZZA_INGREDIENTS);
Object.freeze(PIZZA_MAX_QUANTITIES);
Object.freeze(PIZZA_MAX_INGREDIENTS);
Object.freeze(PIZZA_SIDES);
Object.freeze(PIZZA_PRICES);

const TABLE_ROW_ORDER_ITEM_MAPPINGS = ["quantity", "size", "ingredients", "requests", "subtotal", "extra", "discount", "total"];
const TABLE_ORDER_HEADER = ["quantità", "dimensione", "ingredienti", "richieste", "subtotale", "extra", "sconto", "totale"];

const constants = {
    PIZZA_INGREDIENTS,
    PIZZA_MAX_QUANTITIES,
    PIZZA_MAX_INGREDIENTS,
    PIZZA_SIZES,
    PIZZA_SIDES,
    PIZZA_PRICES,
    TABLE_ORDER_HEADER,
    TABLE_ROW_ORDER_ITEM_MAPPINGS,
};

export default constants;
