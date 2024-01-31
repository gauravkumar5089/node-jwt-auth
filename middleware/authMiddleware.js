import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET_KEY } from "../config/config.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).redirect("/login");
    }
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const id = decodedToken.id;
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(401).redirect("/login");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      next();
    } else {
      const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
      const id = decodedToken.id;
      const user = await User.findById(id);
      res.locals.user = user;
      next();
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default authenticate;
