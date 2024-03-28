const {Router} = require("express");
const task4 = require("../controllers/task4Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/sorting", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task4.renderTask4View);

module.exports = router;   