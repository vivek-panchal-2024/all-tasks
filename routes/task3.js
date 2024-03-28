const {Router} = require("express");
const task3 = require("../controllers/task3Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/tic-tac-toe-game", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task3.renderTask3View);

module.exports = router;   