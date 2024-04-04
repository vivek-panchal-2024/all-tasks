const db = require("../db");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
require("dotenv").config();

let jwtSecretKey = process.env.JWT_SECRET_KEY;
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    // console.log(req.cookies);
    token = req.cookies.token;
  }
  return token;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtSecretKey,
    },
    async (jwtPayload, done) => {
      let sql = `select email from users where email= ?`;
      let findUser = await db.runParameterQuery(sql, [jwtPayload.user.email]);
      if (findUser !== undefined) {
        // console.log(jwtPayload, "payload");
        return done(null, findUser);
      }
      return done(null, false);
    }
  )
);
