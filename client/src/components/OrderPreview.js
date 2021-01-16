import sys from "../utils/constants";
import { Container, ContainerFlex } from "./Container";
import { Button } from "./Button";

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

    //<li key={key} className="container-flex flex-cross-center">

    const handleClickButton = (event) => {
        console.log("SONO BOTTONE", event);
        callback();
    };

    const { size, ingredients = [], requests, quantity } = pizzaOrder;
    return (
        <ContainerFlex key={key} crossAxis="center">
            <Button color="dark" aria-label="Close" handles={{ onClick: handleClickButton }}>
                <span aria-hidden="true">&times;</span>
            </Button>
            <ContainerFlex dir="column">
                <ContainerFlex mainAxis="spaceBetween">
                    <span>{`${quantity} x Pizza ${size}`}</span>
                    <span>{`${pizzaOrder.getSubTotal()} €`}</span>
                </ContainerFlex>
                <span>{`Ingredienti: ${ingredients.map((i) => i.name).join(", ")}`}</span>
                <span>{`Richieste: ${requests ? requests : "none"}`}</span>
                {pizzaOrder.extra ? (
                    <ContainerFlex mainAxis="spaceBetween">
                        <span>{`Extra: `}</span>
                        <span>{`+${(pizzaOrder.getSubTotal() * pizzaOrder.extra) / 100} €`}</span>
                    </ContainerFlex>
                ) : null}
            </ContainerFlex>
        </ContainerFlex>
    );
};

const OrdersList = ({ orders, handleOrderRemove }) => {
    return (
        <Container>
            {orders.map((order, index) =>
                createOrderBullet(order, () => {
                    handleOrderRemove(index);
                })
            )}
        </Container>
    );
};

function computeSubTotal(orders) {
    let total = 0;
    orders.forEach((order) => (total += order.getSubTotal()));
    return total;
}

function computeExtras(orders) {
    let total = 0;
    orders.forEach((order) => (total += order.getSubTotal() * order.extra));
    return total / 100;
}

function totalNumPizza(orders) {
    let total = 0;
    orders.forEach((order) => (total += order.quantity));
    return total;
}

function computeDiscount(orders) {
    let total = 0;
    orders.forEach((order) => (total += order.getSubTotalWithExtras() * order.discount));
    return total / 100;
}

const OrderPreview = ({ orders, handles }) => {
    const subTotal = computeSubTotal(orders);
    const extras = computeExtras(orders);
    const totQuantity = totalNumPizza(orders);
    const discount = computeDiscount(orders);

    return (
        <Container id="id-order-preview" title="Il tuo Ordine">
            <OrdersList orders={orders} handleOrderRemove={handles.onRemove} />
            <ContainerFlex dir="column">
                <ContainerFlex mainAxis="spaceBetween">
                    <span>Subtotale:</span>
                    <span>{subTotal ? `${subTotal} €` : subTotal}</span>
                </ContainerFlex>
                <ContainerFlex mainAxis="spaceBetween">
                    <span>Costi aggiuntivi:</span>
                    <span>{extras ? `+${extras} €` : extras}</span>
                </ContainerFlex>
                <ContainerFlex mainAxis="spaceBetween">
                    <span>{`Sconto (${totQuantity ? "10%" : 0})`}</span>
                    <span>{discount ? `-${discount} €` : 0}</span>
                </ContainerFlex>
                <ContainerFlex mainAxis="spaceBetween">
                    <span>Totale complessivo:</span>
                    <span>{`${subTotal + extras - discount} €`}</span>
                </ContainerFlex>
            </ContainerFlex>
            <Button color="dark">Ordina Adesso</Button>
        </Container>
    );
};

export { OrderPreview };
