import "../styles/Button.css";

const colorMap = {
    dark: "btn-dark",
};

const statusMap = {
    inactive: "btn-inactive",
    active: "btn-active",
};

const Button = ({ id, color, status = {}, handles, children }) => {
    //console.group("Button")
    //console.log(id);
    //console.log(status);
    //console.log(handles);
    //console.groupEnd();
    const classes = ["btn"];
    if (color) {
        classes.push(colorMap[color]);
    }
    if (status) {
        classes.push(statusMap[status.active]);
    }

    return (
        <button id={id} {...handles} className={classes.join(" ")} {...handles} disabled={status.disabled}>
            {children}
        </button>
    );
};

export { Button };
