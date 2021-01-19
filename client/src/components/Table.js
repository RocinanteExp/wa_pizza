import utils from "../utils/utils";
import "../styles/Table.css";

const TableRow = ({ values, children }) => {
    return (
        <tr>
            {values.map((value) => (
                <td key={`key-table-row-${value}`}>{value}</td>
            ))}
            {children}
        </tr>
    );
};

const TableHeader = ({ names = [], children }) => {
    return (
        <thead>
            <tr>
                {names.map((name) => (
                    <th key={`key-table-header-${name}`}>{utils.capitalize(name)}</th>
                ))}
                {children}
            </tr>
        </thead>
    );
};

// TODO the key in TableRow may not be unique
const Table = ({ header, rows, className }) => {
    console.log("SONO TABELLA", rows);
    return (
        <table className={className}>
            <TableHeader names={header} />
            <tbody>
                {rows.map((row) => (
                    <TableRow key={row.join("")} values={row} />
                ))}
            </tbody>
        </table>
    );
};

const beautifyOrderItemValue = (value, prop) => {
    const sideToStringMap = {
        both: null,
        left: "(in parte)",
        right: "(in parte)",
    };

    switch (typeof value) {
        case "number":
            let ret = value;
            if (prop !== "quantity") {
                if (prop === "discount") ret += "%";
                else ret += "€";
            }
            return ret;
        case "string":
            return utils.capitalize(value);
        case "undefined":
            return null;
        case "object": {
            if (prop === "ingredients") {
                const ingredientTuples = [];
                for (const ingredient of value) {
                    const mappedIngredient = { ...ingredient };
                    mappedIngredient.name = utils.capitalize(mappedIngredient.name);
                    mappedIngredient.side = sideToStringMap[mappedIngredient.side];
                    ingredientTuples.push(<li>{Object.values(mappedIngredient).join(" ")}</li>);
                }

                return <ul>{ingredientTuples}</ul>;
            }
        }

        default:
            console.error("normalizeValue default case");
    }
};

/**
 *@param {Array} props.rows is an array of orderItem
 *@param {Array} props.header is an array of string
 */
const TableOrder = (props) => {
    const rowsString = props.rows.map((row) => {
        return props.mapping.map((name) => beautifyOrderItemValue(row[name], name));
    });

    const className = "table-order";
    const newProps = { ...props, rows: rowsString, className };

    return <Table {...newProps} />;
};

export { Table, TableOrder };
