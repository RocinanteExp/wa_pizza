import "../styles/Button.css";

const colorMap = {
    dark: "btn-dark",
    green: "btn-green",
    primary: "btn-primary",
};

const statusMap = {
    inactive: "btn-inactive",
    active: "btn-active",
};

const Button = ({ id, color, status = {}, handles, children, disabled = false, className }) => {
    const classes = ["btn"];
    if (color) {
        classes.push(colorMap[color]);
    }
    if (status) {
        classes.push(statusMap[status.active]);
    }

    const classNameString = className ? classes.join(" ") + " " + className : classes.join(" ");

    return (
        <button id={id} {...handles} disabled={!!disabled} className={classNameString} {...handles}>
            {children}
        </button>
    );
};

export { Button };
