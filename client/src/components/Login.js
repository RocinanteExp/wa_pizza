import { ContainerFlex, Container } from "./Container";
import { useState, useRef } from "react";
import { Button } from "./Button";

const Login = ({ handles }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleOnSubmit = (event) => {
        event.preventDefault();

        if (formEl.current.checkValidity()) {
            handles.onLogin(email, password);
        } else {
            console.log("report handler submit");
            formEl.current.reportValidity();
        }
    };

    return (
        <ContainerFlex id={currComponentId} title="Sign up" dir="column" crossAxis="center">
            <form method="post" className="form" ref={formEl} onSubmit={handleOnSubmit}>
                <ContainerFlex dir="column" crossAxis="center">
                    <input
                        className="form-input"
                        name="email"
                        value={email}
                        type="email"
                        placeholder="mail"
                        autocomplete="off"
                        onChange={handleOnChange}
                        required={true}
                    ></input>
                    <Container>
                        <input
                            className="form-input"
                            name="password"
                            value={password}
                            placeholder="password"
                            type={showPassword ? "text" : "password"}
                            onChange={handleOnChange}
                            required={true}
                        ></input>
                        <span onClick={() => setShowPassword(!showPassword)} className="show">
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </Container>
                    <Button type="submit" color="green" onClick={() => console.log("clicking button")}>
                        Sign Up
                    </Button>
                </ContainerFlex>
            </form>
        </ContainerFlex>
    );
};

export default Login;
