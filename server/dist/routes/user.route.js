"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_service_1 = __importDefault(require("../services/user/user.service"));
const user_repository_1 = __importDefault(require("../repository/user/user.repository"));
const user_model_1 = __importDefault(require("../models/user.model"));
const multer_1 = require("../utils/multer");
const article_repository_1 = __importDefault(require("../repository/article/article.repository"));
const article_model_1 = __importDefault(require("../models/article.model"));
const article_service_1 = __importDefault(require("../services/article/article.service"));
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
const jwt_verify_1 = __importDefault(require("../middlewares/jwt.verify"));
const userRoute = express_1.default.Router();
const userRepository = new user_repository_1.default(user_model_1.default); //creating repository object and passing user model
const userService = new user_service_1.default(userRepository); //di of repository class
const userController = new user_controller_1.default(userService); //di of service class
const articleRepository = new article_repository_1.default(article_model_1.default); // creating repository object passing article model
const articleService = new article_service_1.default(articleRepository, userRepository); //di of repository class
const articleController = new article_controller_1.default(articleService); //di of service class
userRoute.route("/refresh-token").post((req, res) => userController.refreshToken(req, res));
//--------------------------------------------Auth Routes-----------------------------------------------------
userRoute.route("/sign-up").post((req, res) => userController.signUp(req, res));
userRoute.route("/sign-in").post((req, res) => userController.signIn(req, res));
userRoute.route("/sign-out").get((req, res) => userController.signOut(req, res));
//-------------------------------------------------Password Routes-------------------------------------------------
userRoute
    .route("/:id/change-password")
    .patch(jwt_verify_1.default, (req, res) => userController.changePassword(req, res));
//--------------------------------------------------Profile Routes--------------------------------------------------
userRoute
    .route("/:id")
    .all(jwt_verify_1.default)
    .get((req, res) => userController.getProfile(req, res))
    .patch((req, res) => userController.updateProfile(req, res));
//-------------------------------------------------Article Routes------------------------------------------------------
userRoute
    .route("/:id/articles")
    .all(jwt_verify_1.default)
    .post(multer_1.upload.array("images", 2), (req, res) => articleController.addArticle(req, res))
    .get((req, res) => articleController.getAllArticles(req, res));
userRoute
    .route("/:id/my-articles")
    .all(jwt_verify_1.default)
    .get((req, res) => articleController.getMyArticles(req, res));
userRoute
    .route("/:userId/articles/:articleId")
    .all(jwt_verify_1.default)
    .get((req, res) => articleController.getArticle(req, res))
    .delete((req, res) => articleController.deleteArticle(req, res))
    .patch(multer_1.upload.array("images", 2), (req, res) => articleController.updateArticle(req, res));
userRoute
    .route("/:userId/articles/:articleId/block")
    .all(jwt_verify_1.default)
    .patch((req, res) => articleController.blockArticle(req, res));
userRoute
    .route("/:userId/articles/:articleId/like")
    .all(jwt_verify_1.default)
    .patch((req, res) => articleController.likeArticle(req, res));
userRoute
    .route("/:userId/articles/:articleId/dislike")
    .all(jwt_verify_1.default)
    .patch((req, res) => articleController.dislikeArticle(req, res));
//--------------------------------------------------------Token Routes--------------------------------------------------------
exports.default = userRoute;
