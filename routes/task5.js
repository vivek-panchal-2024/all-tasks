const { Router } = require("express");
const task5 = require("../controllers/jsEventsController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get(
  "/js-events",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task5.renderTask5View
);

module.exports = router;
