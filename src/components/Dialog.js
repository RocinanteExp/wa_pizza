import "../styles/Dialog.css";
/**
 * @param {String} message: text to be shown
 * @param {String} type. Allowed types {info, error}
 **/
const Dialog = ({ message, type }) => {
    if (!(type && message)) return null;

    return (
        <div className={`dialog dialog-${type}`}>
            <p className="dialog-message">{message}</p>
        </div>
    );
};

const CenterDialog = ({ message, type }) => {

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%)",
        padding: "0.4rem 1.6rem",
    };

    return (
        <div style={style}>
            <Dialog message={message} type={type} />
        </div>
    );
};

export { Dialog, CenterDialog };
