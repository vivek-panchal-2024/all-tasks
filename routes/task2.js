const {Router} = require("express");
const task2 = require("../controllers/task2Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/kuku-kube-game", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task2.renderTask2View);

module.exports = router;   