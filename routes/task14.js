const { Router } = require("express");
const task14 = require("../controllers/cityStateAjaxController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get(
  "/city-state",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task14.renderCityStateView
);
router.get(
  "/generate-city",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task14.generateCities
);

module.exports = router;
