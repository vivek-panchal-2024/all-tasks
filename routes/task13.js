const { Router } = require("express");
const task13 = require("../controllers/generateInputComponentController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get(
  "/generate-component",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task13.renderGenerateCompView
);

router.post(
  "/generate-component",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task13.generateComp
);
module.exports = router;
