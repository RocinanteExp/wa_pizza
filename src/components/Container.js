import "../styles/Container.css";

const flexMap = {
    crossAxis: {
        center: "flex-cross-center"
    }
}

const Container = ({ id, title, children, className, style }) => {
    return (
        <div id={id} className={`container${className ? " " + className : ""}`} style={style}>
            {title ? <h1>{title}</h1> : null}
            {children}
        </div>
    );
};

const ContainerFlex = (props) => {
    const { dir, mainAxis, crossAxis} = props;
    let className = "container-flex ";
    if(dir) className += dir + " ";
    if(mainAxis) className += flexMap["mainAxis"][mainAxis] + " ";
    if(crossAxis) className += flexMap["crossAxis"][crossAxis] + " ";

    //const className = `container-flex ${dir} ${mainAxis} ${crossAxis} ` + props.className;
    return <Container {...{...props, className}} />;
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
