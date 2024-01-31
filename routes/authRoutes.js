import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

// auth routes

const { signup_get, signup, login_get, login, logout } = authController;

router.get("/signup", signup_get);
router.get("/login", login_get);
router.get("/logout", logout);

router.post("/signup", signup);
router.post("/login", login);

export default router;
