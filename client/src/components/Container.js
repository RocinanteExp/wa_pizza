import "../styles/Container.css";

const flexMap = {
    crossAxis: {
        center: "flex-ca-center",
    },
    dir: {
        column: "flex-dir-col",
    },
    mainAxis: {
        spaceBetween: "flex-ma-sb",
        center: "flex-ma-center",
    },
};

const Container = ({ id, key, title, children, className, style, margin }) => {
    let classNameString = "container";
    if (className) classNameString += " " + className;
    if (margin === "bottom") classNameString += " margin-bottom";

    return (
        <div id={id} key={key} className={classNameString} style={style}>
            {title ? <h1>{title}</h1> : null}
            {children}
        </div>
    );
};

/**
 * Default:
 *  - className container-flex
 *  - behavior: flex-wrap: wrap
 * parameters:
 *  - dir is used to set the direction of the flex container
 *  - mainAxis is used to set the justify-content property
 *  - crossAxis is used to set the align-items property
 **/
const ContainerFlex = (props) => {
    const { dir, mainAxis, crossAxis, padding, className } = props;

    let classNameString = "container-flex";
    if (dir) classNameString += " " + flexMap["dir"][dir];
    if (mainAxis) classNameString += " " + flexMap["mainAxis"][mainAxis];
    if (crossAxis) classNameString += " " + flexMap["crossAxis"][crossAxis];
    if (padding) classNameString += " padding";
    if (className) classNameString += " " + className;

    return <Container {...{ ...props, className: classNameString }} />;
};

//const ContainerFixedSize = ({ id, title, children, className, style }) => {
//    return (
//        <div id={id} className={`container${className ? " " + className : ""}`} style={style}>
//            {title ? <h1>{title}</h1> : null}
//            {children}
//        </div>
//    );
//};

const Border = ({ type, children }) => {
    if (!type) return null;

    const style = {
        border: "2px solid red",
    };

    return <div style={type !== "none" ? style : null}>{children}</div>;
};

export { Container, ContainerFlex, Border };
