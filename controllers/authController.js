import signup from "./signup.js";
import login from "./login.js";
import logout from "./logout.js";

const login_get = (req, res) => res.render("login");
const signup_get = (req, res) => res.render("signup");

export default { login_get, signup_get, login, signup, logout };
