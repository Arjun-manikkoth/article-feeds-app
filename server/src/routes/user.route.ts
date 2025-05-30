import { Router } from "express";
import express from "express";
import UserController from "../controllers/user.controller";
import UserService from "../services/user/user.service";
import UserRepository from "../repository/user/user.repository";
import userModel from "../models/user.model";
import { upload } from "../utils/multer";
import ArticleRepository from "../repository/article/article.repository";
import articleModel from "../models/article.model";
import ArticleService from "../services/article/article.service";
import ArticleController from "../controllers/article.controller";

const userRoute: Router = express.Router();

const userRepository = new UserRepository(userModel); //creating repository object and passing user model
const userService = new UserService(userRepository); //di of repository class
const userController = new UserController(userService); //di of service class
const articleRepository = new ArticleRepository(articleModel); // creating repository object passing article model
const articleService = new ArticleService(articleRepository, userRepository); //di of repository class
const articleController = new ArticleController(articleService); //di of service class

//--------------------------------------------Auth Routes-----------------------------------------------------

userRoute.route("/sign-up").post((req, res) => userController.signUp(req, res));

userRoute.route("/sign-in").post((req, res) => userController.signIn(req, res));

userRoute.route("/sign-out").get((req, res) => userController.signOut(req, res));

//-------------------------------------------------Password Routes-------------------------------------------------

userRoute
    .route("/:id/change-password")
    .patch((req, res) => userController.changePassword(req, res));

//--------------------------------------------------Profile Routes--------------------------------------------------

userRoute
    .route("/:id")
    .get((req, res) => userController.getProfile(req, res))
    .patch((req, res) => userController.updateProfile(req, res));

//-------------------------------------------------Article Routes------------------------------------------------------

userRoute
    .route("/:id/articles")
    .post(upload.array("images", 2), (req, res) => articleController.addArticle(req, res))
    .get((req, res) => articleController.getAllArticles(req, res));

userRoute.route("/:id/my-articles").get((req, res) => articleController.getMyArticles(req, res));

userRoute
    .route("/:userId/articles/:articleId")
    .get((req, res) => articleController.getArticle(req, res))
    .delete((req, res) => articleController.deleteArticle(req, res))
    .patch(upload.array("images", 2), (req, res) => articleController.updateArticle(req, res));

userRoute
    .route("/:userId/articles/:articleId/block")
    .patch((req, res) => articleController.blockArticle(req, res));

userRoute
    .route("/:userId/articles/:articleId/like")
    .patch((req, res) => articleController.likeArticle(req, res));

userRoute
    .route("/:userId/articles/:articleId/dislike")
    .patch((req, res) => articleController.dislikeArticle(req, res));

export default userRoute;
