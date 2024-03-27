const {Router} = require("express");
const authentication = require("../controllers/authController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/", authentication.renderRegistrationView);
router.get("/register", authentication.renderRegistrationView);
router.get("/login", authentication.renderLoginView);
router.get("/reset-password", authentication.renderResetPasswordView);

router.get("/dashboard", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), authentication.renderDashboardView);

router.post("/register", authentication.registerUser);
router.post("/login", authentication.loginUser);

router.post("/reset-password", authentication.resetPassword);
router.get("/activate-user/:code", authentication.activateUser);

module.exports = router;   