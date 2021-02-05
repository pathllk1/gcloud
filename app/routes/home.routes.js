const { authJwt } = require("../middlewares");
const controller = require("../controllers/home.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/", controller.home);
    app.get("/login", controller.login);
    app.get("/register", controller.register);
    app.get("/dash", controller.dash);
    app.get("/dash_auth", [authJwt.verifyToken], controller.dash_auth);
    app.get("/logout", controller.logout);
}