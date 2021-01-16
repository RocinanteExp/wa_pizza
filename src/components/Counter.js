import { useState, useEffect } from "react";
import print from "../utils/printer";
import "../styles/App.css";

const Counter = ({ min, max, callback }) => {
    const [counter, setCounter] = useState(min);

    useEffect(() => {
        print.grp("COUNTER useeffect");
        print.out(counter);
        print.grpend();
        // update the OrderForm state pizzaQuantity
        callback(counter);
        if(counter > max) setCounter(min);
    },[callback, counter, min, max]);

    const handleClick = (operation) => {
        if (operation === "sub") {
            if (counter > min) setCounter((counter) => counter - 1);
        } else if (operation === "add") {
            if (counter < max) setCounter((counter) => counter + 1);
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
