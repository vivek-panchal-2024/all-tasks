const { Router } = require("express");
const task11 = require("../controllers/fetchPromiseController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get(
  "/posts",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task11.renderUserPosts
);
router.get(
  "/post-details",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task11.renderSpecificUserPosts
);

module.exports = router;
