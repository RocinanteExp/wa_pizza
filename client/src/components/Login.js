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

    function genMessage(type, msg) {
        setTypeMessage(type);
        setMessage(msg);
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        if (formEl.current.checkValidity()) {
            setIsWaiting(true);

            try {
                const ret = await generalApi.userLogin(email, password);
                if (typeof ret === "object") {
                    console.log("USER FOUND", ret);
                    handles.onLogin(ret);
                    return;
                }

                switch (ret) {
                    case 401: {
                        genMessage("info", "Email e/o password non validi");
                        break;
                    }
                    default: {
                        throw new Error();
                    }
                }
            } catch (err) {
                genMessage("error", "Fallita la connessione con il server. Ricarica la pagina");
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
                            handles={{ onClick: () => console.log("button login pressed") }}
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
