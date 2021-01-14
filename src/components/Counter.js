import { useState, useEffect } from "react";
import "../styles/App.css";

const Counter = ({ min, max, callback }) => {
    const [counter, setCounter] = useState(1);

    useEffect(() => {
        // update the OrderForm state pizzaQuantity
        callback(counter);
    });

    const handleClick = (operation) => {
        if (operation === "sub") {
            if (counter > min) setCounter(counter - 1);
        } else if (operation === "add") {
            if (counter < max) setCounter(counter + 1);
        } else {
            console.error("operation not implemented in Counter", operation);
        }
    };

    return (
        <div className="container-flex flex-cross-center">
            <button className="btn btn-round" onClick={() => handleClick("sub")}>
                -
            </button>
            <div className="container-flex flex-cross-center flex-main-center screen">{counter}</div>
            <button className="btn btn-round" onClick={() => handleClick("add")}>
                +
            </button>
        </div>
    );
};

export { Counter };
