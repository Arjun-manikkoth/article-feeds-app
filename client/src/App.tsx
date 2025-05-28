import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignUpPage from "./Pages/SignUp";
import SignInPage from "./Pages/SignIn";
import HomePage from "./Pages/Home";
import ProfilePage from "./Pages/Profile";
import ChangePasswordPage from "./Pages/ChangePassword";
import { AuthProtected } from "./Components/Protected/AuthProtected";
import UserProtected from "./Components/Protected/UserProtected";
import AddArticlePage from "./Pages/AddArticle";
import MyArticlesPage from "./Pages/MyArticles";
import ArticleDetailsPage from "./Pages/ArticleDetails";

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
                        <Route path={`/profile`} Component={ProfilePage} />
                        <Route path={`/change-password`} Component={ChangePasswordPage} />
                        <Route path={`/add-article`} Component={AddArticlePage} />
                        <Route path={`/my-articles`} Component={MyArticlesPage} />
                        <Route path={`/view-article/:id`} Component={ArticleDetailsPage} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
};

export default App;
