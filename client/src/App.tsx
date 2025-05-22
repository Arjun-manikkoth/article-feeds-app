import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import signUpPage from "./Pages/SignUp";
import signInPage from "./Pages/SignIn";

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/sign-up" Component={signUpPage} />
                    <Route path="/sign-in" Component={signInPage} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
