const {Router} = require("express");
const task15 = require("../controllers/timeZoneConverterController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/time-zone", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task15.renderTimeZoneView);


module.exports = router;