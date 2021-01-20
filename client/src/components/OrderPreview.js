import { Container, ContainerFlex } from "./Container";
import { Button } from "./Button";

let keyCounter = 0;

const createQuantitySelect = (maxQuantity, defaultQuantity, cb1, cb2) => {
    const optionTags = [];

    optionTags.push(<option value="Rimuovi">Rimuovi</option>);

    for (let i = 1; i <= maxQuantity; i++) {
        optionTags.push(<option value={i}>{i}</option>);
    }

    return (
        <select
            onChange={(event) => {
                if (event.target.value === "Rimuovi") cb1();
                else {
                    cb2(event.target.value);
                }
            }}
            className="select"
            value={defaultQuantity}
        >
            {optionTags}
        </select>
    );
};

const createBullet = (itemOrder, handleOnRemove, handleOnChange) => {
    const key = `key-li-${keyCounter++}`;

    const { size, ingredients = [], requests, quantity } = itemOrder;

    return (
        <ContainerFlex key={key} crossAxis="center">
            {createQuantitySelect(itemOrder.quantity, itemOrder.quantity, handleOnRemove, handleOnChange)}
            <ContainerFlex dir="column" padding="true" className="flex-it-gr-sh">
                <ContainerFlex mainAxis="spaceBetween">
                    <span>{`${quantity} x Pizza ${size}`}</span>
                    <span>{`${itemOrder.subtotal.toFixed(2)} €`}</span>
                </ContainerFlex>
                <span>{`Ingredienti: ${ingredients.map((i) => i.name.toLowerCase()).join(", ")}`}</span>
                <span>{`Richieste: ${requests ? requests.split("-").join(" ") : "nessuna"}`}</span>
                {itemOrder.extra ? (
                    <ContainerFlex mainAxis="spaceBetween">
                        <span>{`Extra: `}</span>
                        <span>{`+${itemOrder.extra.toFixed(2)} €`}</span>
                    </ContainerFlex>
                ) : null}
            </ContainerFlex>
        </ContainerFlex>
    );
};

const ListItems = ({ items, handles }) => {
    return (
        <Container>
            {items.map((item, index) =>
                createBullet(
                    item,
                    () => {
                        handles.onRemove(index);
                    },
                    (quantity) => {
                        handles.onChange(index, item.quantity - quantity);
                    }
                )
            )}
        </Container>
    );
};

function computeSubtotal(items) {
    const total = items.reduce((total, order) => (total += order.subtotal), 0);
    return total;
}

function computeExtra(items) {
    const total = items.reduce((total, order) => (total += order.extra), 0);
    return total;
}

function totalNumPizza(items) {
    const total = items.reduce((total, order) => (total += order.quantity), 0);
    return total;
}

function computeDiscount(items) {
    if (totalNumPizza(items) < 3) return 0;

    const total = computeSubtotal(items) + computeExtra(items);
    return total * 0.1;
}

const OrderPreview = ({ items, handles }) => {
    const totQuantity = totalNumPizza(items);
    const subtotal = computeSubtotal(items);
    const extras = computeExtra(items);
    const discount = computeDiscount(items);

    return (
        <Container id="id-order-preview" title="Il tuo Ordine">
            <ListItems items={items} handles={{ onRemove: handles.onRemove, onChange: handles.onChange }} />
            <ContainerFlex dir="column" className="container-summary">
                <ContainerFlex mainAxis="spaceBetween">
                    <span>Subtotale:</span>
                    <span>{subtotal ? `${subtotal.toFixed(2)} €` : subtotal}</span>
                </ContainerFlex>
                <ContainerFlex mainAxis="spaceBetween">
                    {" "}
                    <span>Costi aggiuntivi:</span>
                    <span>{extras ? `+${extras.toFixed(2)} €` : extras}</span>
                </ContainerFlex>
                <ContainerFlex mainAxis="spaceBetween">
                    <span>{`Sconto (${totQuantity ? "10%" : 0})`}</span>
                    <span>{discount ? `-${discount.toFixed(2)} €` : 0}</span>
                </ContainerFlex>
                <ContainerFlex mainAxis="spaceBetween">
                    <span>Totale complessivo:</span>
                    <span>{`${(subtotal + extras - discount).toFixed(2)} €`}</span>
                </ContainerFlex>
            </ContainerFlex>
            <Button color="dark" handles={{ onClick: handles.onSubmit }} disabled={items.length ? false : true}>
                {items.length ? "Ordina Adesso" : "Niente da inviare"}
            </Button>
        </Container>
    );
};

export { OrderPreview };
