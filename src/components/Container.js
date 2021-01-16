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
    },
};

const Container = ({ id, key, title, children, className, style }) => {

    return (
        <div id={id} key={key} className={`container${className ? " " + className : ""}`} style={style}>
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
    const { dir, mainAxis, crossAxis } = props;

    let className = "container-flex ";
    if (dir) className += flexMap["dir"][dir] + " ";
    if (mainAxis) className += flexMap["mainAxis"][mainAxis] + " ";
    if (crossAxis) className += flexMap["crossAxis"][crossAxis] + " ";

    const style = {
        flex: "1 1 auto",
    };

    return <Container {...{ ...props, className, style }} />;
};

const ContainerFixedSize = ({ id, title, children, className, style }) => {
    return (
        <div id={id} className={`container${className ? " " + className : ""}`} style={style}>
            {title ? <h1>{title}</h1> : null}
            {children}
        </div>
    );
};

const Border = ({ type, children }) => {
    if (!type) return null;

    const style = {
        border: "2px solid red",
    };

    return <div style={type !== "none" ? style : null}>{children}</div>;
};

export { Container, ContainerFlex, Border };
