import { useState, useEffect } from "react";
import "../styles/App.css";

const Counter = ({ callback }) => {
    const [counter, setCounter] = useState(1);

    useEffect(() => {
        callback(counter);
    });

    const handleClick = (operation) => {
        if (operation === "sub") {
            if (counter > 1) setCounter(counter - 1);
        } else if (operation === "add") {
            setCounter(counter + 1);
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
