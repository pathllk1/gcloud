const express = require('express');
const router = express.Router();
const { authJwt } = require("../middlewares");

router.get('/',  (req, res) => {
    var role1 = req.cookies.role;
    var r = role1.includes("ROLE_ADMIN");
    var x = "";
    if(r === true){
        x = "ADMIN"
    }
    res.render("admin/index", {
        viewTitle: "ANJAN - ADMIN", token: req.cookies.user, ADMIN: x
    });
});

router.get('/chk_admin', [authJwt.verifyToken, authJwt.isAdmin],  (req, res) => {
    res.send("ok");
});

module.exports = router;