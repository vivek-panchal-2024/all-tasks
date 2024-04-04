const { Router } = require("express");
const task1 = require("../controllers/dynamicTableController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get(
  "/dynamic-table",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  task1.renderTask1View
);
module.exports = router;
