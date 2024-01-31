import User from "../models/user.js";
import { validateEmail, validatePassword } from "../utilities/validators.js";
import jwt from "jsonwebtoken";

const handleErrors = async (email, password) => {
  const errors = {};
  const user = await User.findOne({ email: email });

  if (!email) {
    errors.email = "email is required";
  } else if (!validateEmail(email)) {
    errors.email = "please enter a valid email";
  } else if (user) {
    errors.email = "email already exists";
  }

  if (Object.keys(errors).length) return errors;

  if (!password) {
    errors.password = "password is required";
  } else if (!validatePassword(password)) {
    errors.password = "please enter a valid password";
  }

  return errors;
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = await handleErrors(email, password);
    console.log(errors);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }
    const user = new User({ email, password });
    await user.save();
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 1, // 1 hour
    });
    res.status(201).json({ user: user._id });
    console.log("user signed up");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
    console.log("Server Error");
  }
};

export default signup;
