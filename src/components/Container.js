const Container = ({ id, title, children, className, style }) => {
    return (
        <div id={id} className={className} style={style}>
            <h1>{title}</h1>
            {children}
        </div>
    );
};

export default Container;
