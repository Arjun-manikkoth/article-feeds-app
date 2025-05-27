import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignUpPage from "./Pages/SignUp";
import SignInPage from "./Pages/SignIn";
import HomePage from "./Pages/Home";
import { AuthProtected } from "./Components/Protected/AuthProtected";
import UserProtected from "./Components/Protected/UserProtected";

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route Component={AuthProtected}>
                        <Route path="/sign-up" Component={SignUpPage} />
                        <Route path="/sign-in" Component={SignInPage} />
                    </Route>
                    <Route Component={UserProtected}>
                        <Route path="/articles" Component={HomePage} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
};

export default App;
