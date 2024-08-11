const cookieParser = require("cookie-parser");
const { validateToken } = require("../services/authentication");

function checkforauthenticationCookie(CookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieParser];
    if (!tokenCookieValue) return next();

    try {
      const userPayload = validateToken(tokenCookieValue);
    } catch (error) {
      return next();
    }
  };
}

module.exports = checkforauthenticationCookie;
