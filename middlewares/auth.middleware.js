const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  req.locals = {}; // Ajoute cette ligne
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      // Vérifiez le nom de la propriété
      const user = await UserModel.findById(decodedToken.userId); // Assurez-vous que c'est userId, ou changez le nom selon votre cas

      if (user) {
        req.locals.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        req.locals.user = null;
        next();
      }
    } catch (error) {
      res.clearCookie("jwt");
      req.locals.user = null;
      next();
    }
  } else {
    req.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {};
