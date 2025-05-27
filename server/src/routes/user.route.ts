import { Router } from "express";
import express from "express";
import UserController from "../controllers/user.controller";
import UserService from "../services/user/user.service";
import UserRepository from "../repository/user/user.repository";
import userModel from "../models/user.model";

const userRoute: Router = express.Router();

const userRepository = new UserRepository(userModel); //creating repository object and passing user model
const userService = new UserService(userRepository); //di of repository class
const userController = new UserController(userService); //di of service class

//--------------------------------------------Auth Routes-----------------------------------------------------

userRoute.route("/sign-up").post((req, res) => userController.signUp(req, res));

userRoute.route("/sign-in").post((req, res) => userController.signIn(req, res));

userRoute.route("/sign-out").get((req, res) => userController.signOut(req, res));

userRoute
    .route("/:id")
    .get((req, res) => userController.getProfile(req, res))
    .patch((req, res) => userController.updateProfile(req, res));

export default userRoute;
