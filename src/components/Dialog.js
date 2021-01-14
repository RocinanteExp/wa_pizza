import "../styles/Dialog.css";

/**
 * @param {String} message: text to be shown
 * @param {String} type. Allowed types {info, error}
 **/
const Dialog = ({ message, type }) => {
    if(!(type && message)) return null;

    return (
        <div className={`dialog dialog-${type}`}>
            <p className="dialog-message">{message}</p>
        </div>
    );
};

export default Dialog;
