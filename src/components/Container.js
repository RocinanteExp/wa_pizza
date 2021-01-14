import "../styles/Container.css";


const Container = ({ id, title, children, className, style }) => {
    return (
        <div id={id} className={`container${className ? " " + className : ""}`} style={style}>
            {title ? <h1>{title}</h1> : null}
            {children}
        </div>
    );
};

const ContainerFixedSize = ({ id, title, children, className, style }) => {
    return (
        <div id={id} className={`container${className ? " " + className : ""}`} style={style}>
            {title ? <h1>{title}</h1> : null}
            {children}
        </div>
    );
};

export default Container;
