const {Router} = require("express");
const task10 = require("../controllers/task10Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/job-application", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task10.renderJobApplication)

router.post("/post-job-application", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task10.postJobApplication);

router.get("/candidate-record", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task10.candidateRecord);

module.exports = router;