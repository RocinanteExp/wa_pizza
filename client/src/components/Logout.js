import { useState } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { ContainerFlex } from "./Container";
import generalApi from "../api/generalApi";

const Logout = ({ handles }) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");

    function genMessage(type, msg) {
        setTypeMessage(type);
        setMessage(msg);
    }

    const handleLogout = async () => {
        try {
            setIsWaiting(true);
            await generalApi.userLogout();
        } catch (err) {
            genMessage("error", "Fallita la connessione con il server. Ricarica la pagina");
        } finally {
            setIsWaiting(false);
            handles.onLogout(null);
        }
    };

    return (
        <>
            {message ? (
                <Dialog type={typeMessage} message={message} handles={{ onClick: () => setMessage("") }} />
            ) : null}
            <ContainerFlex className="container-logout" mainAxis="center" crossAxis="center">
                <Button
                    className="form-btn-submit"
                    disabled={isWaiting}
                    color="primary"
                    handles={{ onClick: handleLogout }}
                >
                    {isWaiting ? "Waiting..." : "Logout"}
                </Button>
            </ContainerFlex>
        </>
    );
};

export default Logout;
