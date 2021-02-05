const express = require('express');
const router = express.Router();
const STOCK = require("../models/stock");
const STOCK_REG = require("../models/stock_reg");

router.get('/',  (req, res) => {
    var role1 = req.cookies.role;
    var r = role1.includes("ROLE_ADMIN");
    var x = "";
    if(r === true){
        x = "ADMIN"
    }
    res.render("bills/purc", {
        viewTitle: "ANJAN - PURCHASE", token: req.cookies.user, ADMIN: x
    });
});

module.exports = router;