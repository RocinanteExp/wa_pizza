import { ContainerFlex, Container } from "./Container";
import generalApi from "../api/generalApi";
import { useState, useRef } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

const Login = ({ handles }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");

    const formEl = useRef();

    const currComponentId = "id-container-login";

    const handleOnChange = (event) => {
        switch (event.target.name) {
            case "email": {
                setEmail(event.target.value);
                return;
            }
            case "password": {
                setPassword(event.target.value);
                return;
            }
            default: {
                console.error("default case Login => handleOnChange");
            }
        }
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        if (formEl.current.checkValidity()) {
            setIsWaiting(true);

            try {
                const ret = await generalApi.userLogin(email, password);
                if (typeof ret === "object") {
                    handles.onLogin(ret);
                    //setTypeMessage("info");
                    //setMessage("Utente trovato");
                    return;
                }

                switch (ret) {
                    case 401: {
                        setTypeMessage("info");
                        setMessage("Email e/o password non validi");
                        break;
                    }
                    default: {
                        throw new Error();
                    }
                }
            } catch (err) {
                setTypeMessage("error");
                setMessage("Fallita la connessione con il server. Ricarica la pagina");
            } finally {
                setIsWaiting(false);
            }
        } else {
            formEl.current.reportValidity();
        }
    };

    return (
        <>
            {message ? (
                <Dialog type={typeMessage} message={message} handles={{ onClick: () => setMessage("") }} />
            ) : null}
            <ContainerFlex id={currComponentId} title="Sign up" dir="column" crossAxis="center">
                <form method="post" className="form-login" ref={formEl} onSubmit={handleOnSubmit}>
                    <ContainerFlex dir="column" crossAxis="center">
                        <input
                            className="form-login-input"
                            name="email"
                            value={email}
                            type="email"
                            placeholder="mail"
                            autoComplete="off"
                            onChange={handleOnChange}
                            required={true}
                        ></input>
                        <Container>
                            <input
                                className="form-login-input"
                                name="password"
                                value={password}
                                placeholder="password"
                                type={showPassword ? "text" : "password"}
                                onChange={handleOnChange}
                                required={true}
                            ></input>
                            <span onClick={() => setShowPassword(!showPassword)} className="form-login-show">
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </Container>
                        <Button
                            className="form-btn-submit"
                            disabled={isWaiting}
                            color="primary"
                            onClick={() => console.log("clicking button")}
                        >
                            {isWaiting ? "Waiting..." : "Sign up"}
                        </Button>
                    </ContainerFlex>
                </form>
            </ContainerFlex>
        </>
    );
};

export default Login;
