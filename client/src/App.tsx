import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import signUpPage from "./Pages/SignUp";

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/sign-up" Component={signUpPage} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
