import User from "../models/user.js";
import { validateEmail } from "../utilities/validators.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config.js";

const handleErrors = async (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = "email is required";
  } else if (!validateEmail(email)) {
    errors.email = "please enter a valid email";
  } else {
    const user = await User.findOne({ email: email });
    if (!user) {
      errors.email = "email doesn't exists";
    }
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  const user = await User.findOne({ email, password });
  if (!user) {
    errors.password = "Incorrect Password";
  }

  return errors;
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = await handleErrors(email, password);

    console.log(errors);

    if (Object.keys(errors).length) {
      res.status(400).json({ errors });
    } else {
      const data = await User.findOne({ email, password });
      if (!data) res.status(401).res.status(200).json({ user: data._id });
      const token = jwt.sign({ id: data._id }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 1, // 1 hour
      });
      res.status(200).json({ user: data._id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
    console.log("Server Error");
  }
};

export default login;
