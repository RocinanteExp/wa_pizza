import constants from "../utils/constants";

let keyCounter = 0;

const createQuantitySelect = (maxQuantity, defaultQuantity, callback) => {
    const optionTags = [];
    optionTags.push(<option value="Rimuovi">Rimuovi</option>);
    for (let i = 1; i <= maxQuantity; i++) {
        optionTags.push(
            <option value={i} selected={defaultQuantity === i ? "selected" : ""}>
                {i}
            </option>
        );
    }

    return (
        <select
            onChange={(event) => {
                if (event.target.value === "Rimuovi") callback();
            }}
            class="select"
        >
            {optionTags}
        </select>
    );
};

const createOrderBullet = (pizzaOrder, callback) => {
    const key = `key-li-${keyCounter++}`;

    const { size, ingredients = [], requests, quantity: defSelection } = pizzaOrder;

    return (
        <li key={key} className="container-flex flex-cross-center">
            {createQuantitySelect(constants.PIZZA_MAX_QUANTITIES[size], defSelection, callback)}
            <div className="container-flex flex-column">
                <span>{`Pizza ${size}`}</span>
                <span>{`Ingredienti: ${ingredients.map(i => i.name).join(", ")}`}</span>
                <span>{`Richieste: ${requests ? requests : "none"}`}</span>
            </div>
        </li>
    );
};

const OrdersList = ({ orders, handleOrderRemove }) => {
    return (
        <div>
            <ul>
                {orders.map((order, index) =>
                    createOrderBullet(order, () => {
                        handleOrderRemove(index);
                    })
                )}
            </ul>
        </div>
    );
};

const OrderPreview = ({ orders, handleOrderRemove }) => {

    const style = {
        margin: "0.35rem 0.9rem",
    };

    return (
        <div id="id-order-preview">
            <h1>Il tuo ordine</h1>
            <OrdersList orders={orders} handleOrderRemove={handleOrderRemove} />
            <button className="btn btn-submit">Ordina Adesso</button>
        </div>
    );
};

export { OrderPreview };
