import "../styles/App.css";
import "../styles/Container.css";
import { useState, createContext, useContext, useEffect } from "react";
import { OrdersHistory } from "./OrdersHistory";
import { Dialog } from "./Dialog";
import OrderBuilder from "./OrderBuilder";
import Login from "./Login";
import Logout from "./Logout";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

const UserContext = createContext(null);

const Navbar = () => {
    const user = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul className="container-flex">
                <li className="navbar-list-item">
                    {user ? `${user.name} ${user.surname}` : <Link to="/login">Login</Link>}
                </li>
                <li className="navbar-list-item">
                    <Link to="/order">Ordina</Link>
                </li>
                {user ? (
                    <>
                        <li className="navbar-list-item">
                            <Link to="/history">I miei ordini</Link>
                        </li>
                        <li className="navbar-list-item">
                            <Link to="/logout">Logout</Link>
                        </li>
                    </>
                ) : null}
            </ul>
        </nav>
    );
};

const App = () => {
    const [user, setUser] = useState(null);
    const [typeMessage, setTypeMessage] = useState("");
    const [message, setMessage] = useState("");

    const handleMessage = (type, message) => {
        setTypeMessage(type);
        setMessage(message);
    };

    const resetMessage = () => {
        setTypeMessage("");
        setMessage("");
    };

    useEffect(() => {
        console.log("Utente connesso (App) =>", user);
    }, [user]);

    return (
        <div>
            <UserContext.Provider value={user}>
                <Router>
                    <Navbar />
                    {message ? <Dialog type={typeMessage} message={message} handles={{ onClick: resetMessage }} /> : null}
                    <Switch>
                        <Route path="/login">
                            {user ? (
                                <Redirect to={"/history"} />
                            ) : (
                                <Login handles={{ onLogin: (user) => setUser(user) }} />
                            )}
                        </Route>
                        <Route path="/logout">
                            {user ? <Logout handles={{ onLogout: () => setUser(null) }} /> : <Redirect to={"/login"} />}
                        </Route>
                        <Route path="/order">
                            <OrderBuilder handles={{ onMessage: handleMessage }} />
                        </Route>
                        <Route path="/history">
                            <OrdersHistory />
                        </Route>
                        <Route path="/">
                            <Redirect to={`/${user ? "history" : "login"}`} />
                        </Route>
                    </Switch>
                </Router>
            </UserContext.Provider>
        </div>
    );
};

export { UserContext };
export default App;
