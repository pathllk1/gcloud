exports.home = (req, res) => {
    res.render('home', {
        viewTitle: "ANJAN - HOME", token: req.cookies.user
    })
};

exports.login = (req, res) => {
    res.render('login', {
        viewTitle: "ANJAN - LOGIN", token: req.cookies.user
    })
};

exports.dash = (req, res) => {
    var role1 = req.cookies.role;
    var r = role1.includes("ROLE_ADMIN");
    var x = "";
    if(r === true){
        x = "ADMIN"
    }
    res.render('dashboard', {
        viewTitle: "ANJAN - DASHBOARD", token: req.cookies.user, ADMIN: x
    })
};

exports.dash_auth = (req, res) => {
    res.send("Jwt Req Ok");
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('user');
    res.clearCookie('role');
    res.redirect("/login");
}